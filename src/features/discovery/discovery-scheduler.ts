import { discoveryConfig } from './discovery-config';
import { DiscoveryStrategy } from './discovery-types';
import { DiscoveryService } from './discovery-service';
import { selectBestProduct } from '../automation/product-selector';
import { runAutomationPipeline } from '../automation/pipeline';
import { CatalogProduct } from '@/features/products/types';
import { AutomationPipelineResult } from '../automation/types';
import { isProductPublished } from '@/features/publishing/published-products-repository';

/**
 * Deterministically selects a subset of 3 strategies from the config
 * based on days since epoch.
 */
export function getScheduledStrategies(
  allStrategies: DiscoveryStrategy[],
  timestamp: number = Date.now()
): DiscoveryStrategy[] {
  const total = allStrategies.length;

  if (total === 0) {
    return [];
  }

  const daysSinceEpoch = Math.floor(
    timestamp / (1000 * 60 * 60 * 24)
  );

  const startIndex = daysSinceEpoch % total;

  const selected: DiscoveryStrategy[] = [];

  for (let i = 0; i < Math.min(3, total); i++) {
    const strategy = allStrategies[(startIndex + i) % total];

    selected.push({
      ...strategy,
      pages: 1,
      pageSize: 20,
    });
  }

  return selected;
}

/**
 * Returns true when the scheduler should run without publishing
 * to Telegram or saving a publication record.
 */
function isDryRunEnabled(): boolean {
  return process.env.DRY_RUN?.trim().toLowerCase() === 'true';
}

/**
 * Removes products that already exist in publication history.
 */
async function filterPreviouslyPublishedProducts(
  products: CatalogProduct[],
  isProductPublishedFn: (source: string, externalId: string) => Promise<boolean>
): Promise<CatalogProduct[]> {
  const checks = await Promise.all(
    products.map(async (product) => {
      try {
        const published = await isProductPublishedFn(
          product.source,
          product.externalId
        );

        return {
          product,
          published,
        };
      } catch (error: unknown) {
        console.error(
          `Failed to check publication history for product ${product.externalId}:`,
          error
        );

        /*
         * Fail closed:
         * If publication history cannot be checked, do not allow the
         * product to continue and risk duplicate publication.
         */
        return {
          product,
          published: true,
        };
      }
    })
  );

  return checks
    .filter((item) => !item.published)
    .map((item) => item.product);
}

/**
 * Scheduled workflow wrapper that handles discovery, validation,
 * publication-history filtering, selection, and pipeline triggering.
 */
export async function runScheduledProductDiscovery(
  isProductPublishedFn: (source: string, externalId: string) => Promise<boolean> = isProductPublished
): Promise<{
  success: boolean;
  status: string;
  code: string;
  message: string;
  selectedProduct?: CatalogProduct;
  pipelineResult?: AutomationPipelineResult;
}> {
  if (
    process.env.AUTOMATION_CATEGORY_ID ||
    process.env.AUTOMATION_CATEGORY_IDS
  ) {
    console.warn(
      'Deprecated AliExpress category ENV variable detected and ignored. Discovery strategies now control product queries.'
    );
  }

  const dryRun = isDryRunEnabled();

  console.log(
    `Scheduled product discovery started. Mode: ${dryRun ? 'DRY_RUN' : 'LIVE'
    }`
  );

  const allStrategies = discoveryConfig.strategies;
  const activeStrategies = getScheduledStrategies(allStrategies);

  if (activeStrategies.length === 0) {
    return {
      success: false,
      status: 'error',
      code: 'NO_STRATEGIES_CONFIGURED',
      message: 'No discovery strategies configured.',
    };
  }

  const discoveryService = new DiscoveryService({
    requestDelayMs: 0,
  });

  const discoveryResult = await discoveryService.discover(
    activeStrategies
  );

  const { eligible } = discoveryResult.filteringResult;

  if (eligible.length === 0) {
    return {
      success: true,
      status: 'no-products',
      code: 'NO_ELIGIBLE_PRODUCTS',
      message:
        'No eligible candidate products found after discovery filtering.',
    };
  }

  const eligibleProducts = eligible.map((item) => item.product);

  /*
   * Exclude products that have already been published before sending
   * candidates into the selection engine.
   */
  const unpublishedProducts =
    await filterPreviouslyPublishedProducts(eligibleProducts, isProductPublishedFn);

  console.log(
    `Publication-history filtering: ${eligibleProducts.length} eligible, ${unpublishedProducts.length} unpublished.`
  );

  if (unpublishedProducts.length === 0) {
    return {
      success: true,
      status: 'no-products',
      code: 'NO_UNPUBLISHED_PRODUCTS',
      message:
        'All eligible candidate products have already been published.',
    };
  }

  const selection = selectBestProduct(unpublishedProducts);
  const selectedProduct = selection.product;

  if (!selectedProduct) {
    return {
      success: true,
      status: 'no-products',
      code: 'NO_SELECTION_ELIGIBLE_PRODUCT',
      message:
        'No unpublished product passed the selection requirements.',
    };
  }

  const pipelineResult = await runAutomationPipeline({
    product: selectedProduct,
    dryRun,
  });

  return {
    success: true,
    status: dryRun ? 'dry-run' : 'success',
    code: dryRun
      ? 'PRODUCT_PROCESSED_DRY_RUN'
      : 'PRODUCT_PUBLISHED',
    message: dryRun
      ? 'Scheduled product was discovered and processed in dry-run mode.'
      : 'Scheduled product was discovered, selected, and processed successfully.',
    selectedProduct,
    pipelineResult,
  };
}