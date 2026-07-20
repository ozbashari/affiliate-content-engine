/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, prefer-rest-params */
import assert from 'assert';
import Module from 'module';

(process.env as any).NODE_ENV = 'test';

// Mock 'server-only'
const originalResolveFilename = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function(request: string, parent: any, isMain: boolean, options: any) {
  if (request === 'server-only') {
    return 'server-only';
  }
  return originalResolveFilename.apply(this, arguments);
};
require.cache['server-only'] = {
  id: 'server-only',
  filename: 'server-only',
  loaded: true,
  exports: {},
  parent: null,
  children: [],
  paths: []
} as any;

// Set mock environment variables for unit tests to bypass config validation
process.env.ALIEXPRESS_APP_KEY = '123456';
process.env.ALIEXPRESS_APP_SECRET = 'mock_secret';
process.env.ALIEXPRESS_TRACKING_ID = 'mock_tracking';

import { AliExpressClient } from '../src/lib/aliexpress';

// Mock client execution
let executeMock: (method: string, params: any) => Promise<any> = () => {
  throw new Error('No mock set');
};

AliExpressClient.prototype.execute = function (method: string, params: any) {
  return executeMock(method, params);
};

// Import discovery features dynamically
async function runTests() {
  const { DiscoveryService } = await import('../src/features/discovery/discovery-service');
  const { deduplicateProducts } = await import('../src/features/discovery/discovery-deduplicator');
  const { filterProducts } = await import('../src/features/discovery/discovery-filter');

  console.log('Running Discovery Engine tests...\n');

  // Test 1: Keyword strategy request parameters creation
  {
    console.log('Test 1: Keyword strategy request creation');
    let capturedParams: any = null;
    executeMock = async (method, params) => {
      capturedParams = params;
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: { products: { product: [] } }
          }
        }
      };
    };

    const service = new DiscoveryService();
    try {
      await service.discover([
        { type: 'keyword', keyword: 'test-kw', pages: 1, pageSize: 20, sort: 'priceAsc' }
      ]);
    } catch {
      // Expect failure because of empty candidates, but we check parameters first
    }

    assert.ok(capturedParams, 'Should execute request');
    assert.strictEqual(capturedParams.keywords, 'test-kw');
    assert.strictEqual(capturedParams.page_no, 1);
    assert.strictEqual(capturedParams.page_size, 20);
    assert.strictEqual(capturedParams.sort, 'priceAsc');
    assert.strictEqual(capturedParams.category_ids, undefined, 'Unused fields should not be present');
  }

  // Test 2: Category strategy request parameters creation
  {
    console.log('Test 2: Category strategy request creation');
    let capturedParams: any = null;
    executeMock = async (method, params) => {
      capturedParams = params;
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: { products: { product: [] } }
          }
        }
      };
    };

    const service = new DiscoveryService();
    try {
      await service.discover([
        { type: 'category', categoryId: '12345', pages: 1, pageSize: 15 }
      ]);
    } catch {
      // Expect failure
    }

    assert.ok(capturedParams, 'Should execute request');
    assert.strictEqual(capturedParams.category_ids, '12345');
    assert.strictEqual(capturedParams.page_no, 1);
    assert.strictEqual(capturedParams.page_size, 15);
    assert.strictEqual(capturedParams.keywords, undefined);
  }

  // Test 3: Pagination stops on an empty page
  {
    console.log('Test 3: Pagination stops on an empty page');
    let requestsCount = 0;
    executeMock = async (method, params) => {
      requestsCount++;
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: { products: { product: [] } } // Empty page
          }
        }
      };
    };

    const service = new DiscoveryService();
    try {
      await service.discover([
        { type: 'keyword', keyword: 'test-kw', pages: 5, pageSize: 20 }
      ]);
    } catch {}

    assert.strictEqual(requestsCount, 1, 'Should stop after page 1 returned empty');
  }

  // Test 4: Pagination stops on a partial page
  {
    console.log('Test 4: Pagination stops on a partial page');
    let requestsCount = 0;
    executeMock = async (method, params) => {
      requestsCount++;
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: {
              products: {
                product: [
                  { product_id: 'prod1', product_title: 'Title 1', sale_price: '10', promotion_link: 'http://link' }
                ]
              }
            }
          }
        }
      };
    };

    const service = new DiscoveryService();
    try {
      await service.discover([
        { type: 'keyword', keyword: 'test-kw', pages: 5, pageSize: 20 } // Requested 20, returned 1
      ]);
    } catch {}

    assert.strictEqual(requestsCount, 1, 'Should stop after first page returned fewer than pageSize');
  }

  // Test 5: Products from multiple strategies are merged & deduplicated by externalId
  {
    console.log('Test 5: Products from multiple strategies are merged & duplicates removed');
    const mockProduct1 = {
      product_id: 'p1',
      product_title: 'Shared Product',
      sale_price: '15',
      product_main_image_url: 'img1',
      product_detail_url: 'url1',
      promotion_link: 'http://promo1'
    };

    executeMock = async (method, params) => {
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: { products: { product: [mockProduct1] } }
          }
        }
      };
    };

    const service = new DiscoveryService();
    const result = await service.discover([
      { type: 'keyword', keyword: 'keywordA', pages: 1, pageSize: 20 },
      { type: 'keyword', keyword: 'keywordB', pages: 1, pageSize: 20 }
    ]);

    assert.strictEqual(result.filteringResult.eligible.length, 1, 'Duplicate externalId should be merged into 1 unique product');
    
    // Test 6: Duplicate products preserve multiple origins
    console.log('Test 6: Duplicate products preserve multiple origins');
    const unique = result.filteringResult.eligible[0];
    assert.strictEqual(unique.origins.length, 2, 'Should preserve both strategy origins');
    assert.strictEqual(unique.origins[0].strategyValue, 'keywordA');
    assert.strictEqual(unique.origins[1].strategyValue, 'keywordB');
  }

  // Test 7: Malformed products are rejected
  {
    console.log('Test 7: Malformed products are rejected');
    const mockProducts = [
      // Valid
      { product_id: 'valid', product_title: 'Valid Product', sale_price: '10.5', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://promo' },
      // Missing title
      { product_id: 'p1', sale_price: '10.5', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://promo' },
      // Price = 0
      { product_id: 'p2', product_title: 'Zero Price', sale_price: '0', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://promo' },
      // Missing affiliateUrl (and productUrl to generate it)
      { product_id: 'p3', product_title: 'No URL', sale_price: '5', product_main_image_url: 'img' }
    ];

    executeMock = async (method, params) => {
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: { products: { product: mockProducts } }
          }
        }
      };
    };

    const service = new DiscoveryService();
    const result = await service.discover([
      { type: 'keyword', keyword: 'kw', pages: 1, pageSize: 20 }
    ]);

    assert.strictEqual(result.filteringResult.eligible.length, 1, 'Only the valid product should be eligible');
    assert.strictEqual(result.filteringResult.rejected.length, 3, 'Three malformed products should be rejected');
    assert.strictEqual(result.filteringResult.eligible[0].product.externalId, 'valid');
  }

  // Test 8: One failed strategy does not cancel successful strategies
  {
    console.log('Test 8: One failed strategy does not cancel successful strategies');
    let attempt = 0;
    executeMock = async (method, params) => {
      attempt++;
      if (attempt === 1) {
        throw new Error('Network timeout simulation');
      }
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: {
              products: {
                product: [
                  { product_id: 'success-id', product_title: 'Good Product', sale_price: '5', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://promo' }
                ]
              }
            }
          }
        }
      };
    };

    const service = new DiscoveryService();
    const result = await service.discover([
      { type: 'keyword', keyword: 'failing-kw', pages: 1, pageSize: 20 },
      { type: 'keyword', keyword: 'winning-kw', pages: 1, pageSize: 20 }
    ]);

    assert.strictEqual(result.stats.strategiesExecuted, 2);
    assert.strictEqual(result.filteringResult.eligible.length, 1);
    assert.strictEqual(result.filteringResult.eligible[0].product.externalId, 'success-id');
  }

  // Test 9: Discovery fails when no eligible candidates remain
  {
    console.log('Test 9: Discovery fails when no eligible candidates remain');
    executeMock = async (method, params) => {
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: { products: { product: [] } }
          }
        }
      };
    };

    const service = new DiscoveryService();
    await assert.rejects(
      async () => {
        await service.discover([
          { type: 'keyword', keyword: 'empty', pages: 1, pageSize: 20 }
        ]);
      },
      /Discovery failed/
    );
  }

  // Test 10: Price thresholds and currency verification inside filtering & selection
  {
    console.log('Test 10: Price boundaries and currency verification');
    
    const { selectBestProduct } = await import('../src/features/automation/product-selector');

    const mockProducts = [
      // 1.99 USD is very low but eligible
      { product_id: 'low', product_title: 'Low Price Item', sale_price: '1.99', target_currency: 'USD', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://p' },
      // 2 USD is preferred
      { product_id: 'pref2', product_title: 'Pref 2 USD Item', sale_price: '2.00', target_currency: 'USD', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://p' },
      // 30 USD is preferred
      { product_id: 'pref30', product_title: 'Pref 30 USD Item', sale_price: '30.00', target_currency: 'USD', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://p' },
      // 30.01 USD is mid range
      { product_id: 'mid30_01', product_title: 'Mid Item', sale_price: '30.01', target_currency: 'USD', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://p' },
      // 50 USD is mid range
      { product_id: 'mid50', product_title: 'Mid 50 Item', sale_price: '50.00', target_currency: 'USD', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://p' },
      // 50.01 USD is high but eligible
      { product_id: 'high50_01', product_title: 'High Eligible', sale_price: '50.01', target_currency: 'USD', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://p' },
      // 75 USD is eligible
      { product_id: 'eligible75', product_title: 'Borderline Item', sale_price: '75.00', target_currency: 'USD', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://p' },
      // 75.01 USD is rejected
      { product_id: 'rejected75_01', product_title: 'Expensive Item', sale_price: '75.01', target_currency: 'USD', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://p' },
      // non-USD currency is rejected
      { product_id: 'non_usd', product_title: 'EUR Item', sale_price: '10.00', target_currency: 'EUR', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://p' }
    ];

    executeMock = async (method, params) => {
      assert.strictEqual(params.target_currency, 'USD', 'Every discovery request must explicitly send target_currency: "USD"');
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: { products: { product: mockProducts } }
          }
        }
      };
    };

    const service = new DiscoveryService();
    const result = await service.discover([
      { type: 'keyword', keyword: 'price-test', pages: 1, pageSize: 20 }
    ]);

    const { eligible, rejected } = result.filteringResult;

    const eligibleIds = eligible.map(item => item.product.externalId);
    const rejectedIds = rejected.map(item => item.product.product.externalId);

    assert.ok(rejectedIds.includes('rejected75_01'), '75.01 USD must be rejected');
    assert.ok(rejectedIds.includes('non_usd'), 'non-USD currency must be rejected');
    assert.ok(eligibleIds.includes('low'), '1.99 USD should be eligible');
    assert.ok(eligibleIds.includes('pref2'), '2 USD should be eligible');
    assert.ok(eligibleIds.includes('pref30'), '30 USD should be eligible');
    assert.ok(eligibleIds.includes('mid30_01'), '30.01 USD should be eligible');
    assert.ok(eligibleIds.includes('mid50'), '50 USD should be eligible');
    assert.ok(eligibleIds.includes('high50_01'), '50.01 USD should be eligible');
    assert.ok(eligibleIds.includes('eligible75'), '75 USD should be eligible');

    const lowSelection = selectBestProduct([eligible.find(i => i.product.externalId === 'low')!.product]);
    assert.ok(lowSelection.warnings.some(w => w.includes('Very low price')), 'Below 2 USD should receive a warning');

    const prefSelection = selectBestProduct([eligible.find(i => i.product.externalId === 'pref2')!.product]);
    assert.ok(prefSelection.reasons.some(r => r.includes('preferred 2–30 USD range')), '2 USD should have preferred reason');

    const pref30Selection = selectBestProduct([eligible.find(i => i.product.externalId === 'pref30')!.product]);
    assert.ok(pref30Selection.reasons.some(r => r.includes('preferred 2–30 USD range')), '30 USD should have preferred reason');

    const mid30Selection = selectBestProduct([eligible.find(i => i.product.externalId === 'mid30_01')!.product]);
    assert.ok(mid30Selection.reasons.some(r => r.includes('above the preferred range but below the 75 USD maximum')), '30.01 USD should have mid-range reason');

    const mid50Selection = selectBestProduct([eligible.find(i => i.product.externalId === 'mid50')!.product]);
    assert.ok(mid50Selection.reasons.some(r => r.includes('above the preferred range but below the 75 USD maximum')), '50 USD should have mid-range reason');

    const highSelection = selectBestProduct([eligible.find(i => i.product.externalId === 'high50_01')!.product]);
    assert.ok(highSelection.warnings.some(w => w.includes('Higher price range')), '50.01 USD should have higher range warning');

    const borderlineSelection = selectBestProduct([eligible.find(i => i.product.externalId === 'eligible75')!.product]);
    assert.ok(borderlineSelection.warnings.some(w => w.includes('Higher price range')), '75 USD should have higher range warning');
  }

  // Test 11: Preferred-range product outranks a comparable 60 USD product, and high rating cannot bypass hard max
  {
    console.log('Test 11: Preferred-range preference and high-rating maximum bypass prevention');
    const { selectBestProduct } = await import('../src/features/automation/product-selector');
    
    const prodPreferred = {
      id: 'pref',
      source: 'aliexpress' as const,
      externalId: 'pref',
      title: 'Awesome Gadget',
      price: { amount: 15, currency: 'USD' },
      rating: 4.8,
      salesCount: 10,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'draft' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const prodExpensive = {
      id: 'expensive',
      source: 'aliexpress' as const,
      externalId: 'expensive',
      title: 'Awesome Expensive Gadget',
      price: { amount: 60, currency: 'USD' },
      rating: 4.8,
      salesCount: 10,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'draft' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const best = selectBestProduct([prodPreferred, prodExpensive]);
    assert.strictEqual(best.product!.externalId, 'pref', 'Preferred-price product should outrank a comparable 60 USD product');

    const rawUltra = {
      product_id: 'ultra',
      product_title: 'Ultra Expensive Perfect Item',
      sale_price: '120.00',
      target_currency: 'USD',
      product_main_image_url: 'img',
      product_detail_url: 'det',
      promotion_link: 'http://p',
      evaluate_rate: '500', // high rating
      lastest_volume: '1000'
    };

    const rawPref = {
      product_id: 'pref',
      product_title: 'Awesome Gadget',
      sale_price: '15.00',
      target_currency: 'USD',
      product_main_image_url: 'img',
      product_detail_url: 'det',
      promotion_link: 'http://p',
      evaluate_rate: '480',
      lastest_volume: '10'
    };

    executeMock = async (method, params) => {
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: { products: { product: [rawUltra, rawPref] } }
          }
        }
      };
    };

    const service = new DiscoveryService();
    const result = await service.discover([
      { type: 'keyword', keyword: 'rank-test', pages: 1, pageSize: 20 }
    ]);
    const { eligible } = result.filteringResult;
    const finalSelection = selectBestProduct(eligible.map(i => i.product));
    assert.strictEqual(finalSelection.product!.externalId, 'pref', 'High rating above 75 USD cannot win because it is rejected by filtering');
  }

  // Test 12: Scheduled production flow uses DiscoveryService and deprecated category variables do not influence requests
  {
    console.log('Test 12: Scheduled production flow ignores deprecated category env variables');
    const { runScheduledProductDiscovery, getScheduledStrategies } = await import('../src/features/discovery/discovery-scheduler');

    process.env.AUTOMATION_CATEGORY_ID = '99999';
    process.env.AUTOMATION_CATEGORY_IDS = '88888,77777';

    executeMock = async (method, params) => {
      assert.strictEqual(params.category_ids, undefined, 'Deprecated category variables must NOT be injected into the Discovery requests');
      return {
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            result: {
              products: {
                product: [
                  { product_id: 'good-scheduled', product_title: 'Scheduled Item', sale_price: '10', target_currency: 'USD', product_main_image_url: 'img', product_detail_url: 'det', promotion_link: 'http://p' }
                ]
              }
            }
          }
        }
      };
    };

    const scheduledStrategies = getScheduledStrategies([
      { type: 'keyword', keyword: 'scheduled-keyword', pages: 1, pageSize: 20 }
    ]);

    assert.strictEqual(scheduledStrategies[0].type, 'keyword');
    assert.strictEqual(scheduledStrategies[0].pageSize, 20);

    const runResult = await runScheduledProductDiscovery(async () => false);
    assert.ok(runResult.success, 'Scheduled workflow should complete successfully');
    assert.strictEqual(runResult.selectedProduct?.externalId, 'good-scheduled');

    delete process.env.AUTOMATION_CATEGORY_ID;
    delete process.env.AUTOMATION_CATEGORY_IDS;
  }

  // Test 13: Selection-quality adjustments, warnings, and priorities
  {
    console.log('Test 13: Selection-quality adjustments, warnings, and priorities');
    const { selectBestProduct } = await import('../src/features/automation/product-selector');

    const p1 = {
      id: 'sink-org',
      source: 'aliexpress' as const,
      externalId: 'sink-org',
      title: 'Stainless Steel Kitchen Sink Organizer Storage Rack',
      price: { amount: 15.00, currency: 'USD' },
      rating: 4.5,
      salesCount: 10,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'sink organizer', page: 1 }]
    };

    const p2 = {
      id: 'dollhouse-model',
      source: 'aliexpress' as const,
      externalId: 'dollhouse-model',
      title: '5Pcs 1/12 Dollhouse Miniature Kitchen Simulation Model Plates',
      price: { amount: 5.00, currency: 'USD' },
      rating: 5.0,
      salesCount: 100,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'vegetable chopper', page: 1 }]
    };

    const res1 = selectBestProduct([p1, p2]);
    assert.strictEqual(res1.product!.externalId, 'sink-org', 'Complete relevant sink organizer must outrank dollhouse kitchen model');

    const p3 = {
      id: 'no-rating-relevant',
      source: 'aliexpress' as const,
      externalId: 'no-rating-relevant',
      title: 'Stainless Steel Kitchen Peeler Vegetable Slicer',
      price: { amount: 10.00, currency: 'USD' },
      salesCount: 5,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'vegetable chopper', page: 1 }]
    };

    const p4 = {
      id: 'anime-merch-high-rating',
      source: 'aliexpress' as const,
      externalId: 'anime-merch-high-rating',
      title: 'Cute Anime Cosplay Keychain Gift Accessories',
      price: { amount: 4.00, currency: 'USD' },
      rating: 5.0,
      salesCount: 200,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'vegetable chopper', page: 1 }]
    };

    const res2 = selectBestProduct([p3, p4]);
    assert.strictEqual(res2.product!.externalId, 'no-rating-relevant', 'Relevant product without rating outranks irrelevant character merchandise with high rating');

    const p5 = {
      id: 'pref-price-medium-relevance',
      source: 'aliexpress' as const,
      externalId: 'pref-price-medium-relevance',
      title: 'Generic Kitchen Thingy',
      price: { amount: 8.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 20,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'vegetable chopper', page: 1 }]
    };

    const p6 = {
      id: 'mid-price-high-relevance',
      source: 'aliexpress' as const,
      externalId: 'mid-price-high-relevance',
      title: 'Stainless Steel Vegetable Chopper Slicer Tool',
      price: { amount: 35.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 20,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'vegetable chopper', page: 1 }]
    };

    const res3 = selectBestProduct([p5, p6]);
    assert.strictEqual(res3.product!.externalId, 'mid-price-high-relevance', 'High relevance product should win over preferred price range medium relevance product');

    const miniWarnings = selectBestProduct([p2]).rankedProducts?.[0]?.warnings || [];
    assert.ok(miniWarnings.some(w => w.includes('Miniature or toy warning')), 'Miniature 1/12 product must receive miniature warning');

    const merchWarnings = selectBestProduct([p4]).rankedProducts?.[0]?.warnings || [];
    assert.ok(merchWarnings.some(w => w.includes('Character merchandise warning')), 'Character merchandise must receive character warning');

    const p7 = {
      id: 'replacement-part',
      source: 'aliexpress' as const,
      externalId: 'replacement-part',
      title: 'Replacement Faucet Knob Handle Screw Spare Part',
      price: { amount: 15.00, currency: 'USD' },
      rating: 4.9,
      salesCount: 500,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'sink organizer', page: 1 }]
    };

    const res4 = selectBestProduct([p1, p7]);
    assert.strictEqual(res4.product!.externalId, 'sink-org', 'Replacement part must not win over a complete sink organizer');

    const p8 = {
      id: 'above-75',
      source: 'aliexpress' as const,
      externalId: 'above-75',
      title: 'Expensive Sink Organizer',
      price: { amount: 80.00, currency: 'USD' },
      rating: 4.9,
      salesCount: 500,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'sink organizer', page: 1 }]
    };

    assert.throws(
      () => {
        selectBestProduct([p8]);
      },
      /Invariant Violation/
    );
  }

  // Test 14: Consumer Readiness and Decorative Low-Value Penalties
  {
    console.log('Test 14: Consumer Readiness and Decorative Low-Value Penalties');
    const { selectBestProduct, computeConsumerReadiness } = await import('../src/features/automation/product-selector');

    const plug = {
      id: 'smart-plug-test',
      source: 'aliexpress' as const,
      externalId: 'smart-plug-test',
      title: 'Smart Plug WiFi Socket Outlet 16A',
      price: { amount: 10.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 100,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'smart plug', page: 1 }]
    };

    const breaker = {
      id: 'circuit-breaker-test',
      source: 'aliexpress' as const,
      externalId: 'circuit-breaker-test',
      title: 'Tuya Smart Circuit Breaker MCB DIN Rail 63A Switch',
      price: { amount: 10.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 100,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'smart plug', page: 1 }]
    };

    const res1 = selectBestProduct([plug, breaker]);
    assert.strictEqual(res1.product!.externalId, 'smart-plug-test', 'Smart plug must outrank a DIN-rail circuit breaker');

    const motionLight = {
      id: 'motion-light-test',
      source: 'aliexpress' as const,
      externalId: 'motion-light-test',
      title: 'Motion Sensor LED Night Light Wireless cabinet light',
      price: { amount: 8.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 50,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'motion sensor light', page: 1 }]
    };

    const radarModule = {
      id: 'radar-module-test',
      source: 'aliexpress' as const,
      externalId: 'radar-module-test',
      title: '24G HLK-LD2450 Human Movement Tracking Radar Sensor Module Development Board',
      price: { amount: 8.00, currency: 'USD' },
      rating: 5.0,
      salesCount: 50,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'motion sensor light', page: 1 }]
    };

    const res2 = selectBestProduct([motionLight, radarModule]);
    assert.strictEqual(res2.product!.externalId, 'motion-light-test', 'Motion sensor light must outrank a radar sensor module');

    const phoneHolder = {
      id: 'phone-holder-test',
      source: 'aliexpress' as const,
      externalId: 'phone-holder-test',
      title: 'Gravity Car Phone Holder Auto Air Vent Mount Clip Stand',
      price: { amount: 12.00, currency: 'USD' },
      rating: 4.7,
      salesCount: 200,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'car phone holder', page: 1 }]
    };

    const carPendant = {
      id: 'pendant-test',
      source: 'aliexpress' as const,
      externalId: 'pendant-test',
      title: 'Cute Cartoon Dog Car Pendant Rearview Mirror Hanging Ornament Charm',
      price: { amount: 12.00, currency: 'USD' },
      rating: 4.9,
      salesCount: 200,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'car phone holder', page: 1 }]
    };

    const res3 = selectBestProduct([phoneHolder, carPendant]);
    assert.strictEqual(res3.product!.externalId, 'phone-holder-test', 'Car phone holder must outrank a decorative car pendant');

    const res4 = selectBestProduct([plug, radarModule]);
    assert.strictEqual(res4.product!.externalId, 'smart-plug-test', 'High-relevance technical module cannot beat a high-readiness consumer product');

    const switchReadiness = computeConsumerReadiness('Tuya Smart Switch Socket 16A');
    assert.strictEqual(switchReadiness.level, 'medium', 'Smart switch alone must not trigger a technical penalty');

    const breakerReadiness = computeConsumerReadiness('Circuit Breaker DIN Rail 63A');
    assert.strictEqual(breakerReadiness.level, 'low', 'Circuit breaker + DIN rail must trigger low readiness');

    const moduleReadiness = computeConsumerReadiness('Radar Sensor Module Development Board');
    assert.strictEqual(moduleReadiness.level, 'low', 'Module + development board must trigger low readiness');

    const pendantScore = res3.rankedProducts?.find(x => x.product.externalId === 'pendant-test')?.score ?? 0;
    const holderScore = res3.rankedProducts?.find(x => x.product.externalId === 'phone-holder-test')?.score ?? 0;
    assert.ok(holderScore > pendantScore + 50, 'Decorative terms must be penalized for functional intents');
  }

  // Test 15: Product Type Validation and Classification Invariant framework
  {
    console.log('Test 15: Product Type Validation and Classification Invariant framework');
    const { selectBestProduct, computeConsumerReadiness, CLASSIFICATION_INVARIANTS } = await import('../src/features/automation/product-selector');

    const completeHolder = {
      id: 'complete-holder',
      source: 'aliexpress' as const,
      externalId: 'complete-holder',
      title: 'Baseus Gravity Car Phone Holder Dashboard Mount Auto Stand',
      price: { amount: 15.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 150,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'car phone holder', page: 1 }]
    };

    const phoneCase = {
      id: 'phone-case',
      source: 'aliexpress' as const,
      externalId: 'phone-case',
      title: 'Shockproof Case for iPhone 15 Pro Max cover shell',
      price: { amount: 15.00, currency: 'USD' },
      rating: 4.9,
      salesCount: 150,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'car phone holder', page: 1 }]
    };

    const res1 = selectBestProduct([completeHolder, phoneCase]);
    assert.strictEqual(res1.product!.externalId, 'complete-holder', 'Complete car phone holder must outrank phone case');

    const magRing = {
      id: 'mag-ring',
      source: 'aliexpress' as const,
      externalId: 'mag-ring',
      title: 'Magnetic Ring Mount Plate Accessories for phone holder',
      price: { amount: 15.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 150,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'car phone holder', page: 1 }]
    };

    const res2 = selectBestProduct([completeHolder, magRing]);
    assert.strictEqual(res2.product!.externalId, 'complete-holder', 'Dashboard mount must outrank magnetic ring accessory');

    const mountPlateRanked = res2.rankedProducts?.find(p => p.product.externalId === 'mag-ring');
    assert.ok(mountPlateRanked, 'mag-ring must exist in ranked list');
    assert.notStrictEqual(mountPlateRanked.relevanceLevel, 'high', 'a mount plate cannot receive high relevance for car phone holder');

    const dollhouseReadiness = computeConsumerReadiness('5Pcs 1/12 Dollhouse Miniature Kitchen Simulation Model Plates');
    assert.strictEqual(dollhouseReadiness.level, 'low', 'Dollhouse product must be low consumer readiness');

    const dollhouseProduct = {
      id: 'dollhouse-prod',
      source: 'aliexpress' as const,
      externalId: 'dollhouse-prod',
      title: '5Pcs 1/12 Dollhouse Miniature Kitchen Simulation Model Plates',
      price: { amount: 5.00, currency: 'USD' },
      rating: 5.0,
      salesCount: 200,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'smart plug', page: 1 }]
    };

    const smartPlug = {
      id: 'valid-plug',
      source: 'aliexpress' as const,
      externalId: 'valid-plug',
      title: 'Smart Plug WiFi Socket Outlet 16A Alexa',
      price: { amount: 10.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 100,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'smart plug', page: 1 }]
    };

    const res3 = selectBestProduct([dollhouseProduct, smartPlug]);
    assert.strictEqual(res3.product!.externalId, 'valid-plug', 'Smart plug must win and dollhouse must be deprioritized');

    const carVacuum = {
      id: 'car-vacuum',
      source: 'aliexpress' as const,
      externalId: 'car-vacuum',
      title: 'Handheld Car Vacuum Cleaner Portable Cordless 5000Pa Suction',
      price: { amount: 20.00, currency: 'USD' },
      rating: 4.7,
      salesCount: 100,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'car vacuum cleaner', page: 1 }]
    };

    const nozzle = {
      id: 'replacement-nozzle',
      source: 'aliexpress' as const,
      externalId: 'replacement-nozzle',
      title: 'Replacement Nozzle only for vacuum cleaner spare parts',
      price: { amount: 5.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 100,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'car vacuum cleaner', page: 1 }]
    };

    const res4 = selectBestProduct([carVacuum, nozzle]);
    assert.strictEqual(res4.product!.externalId, 'car-vacuum', 'Complete car vacuum must outrank replacement nozzle');

    const relayModule = {
      id: 'relay-module',
      source: 'aliexpress' as const,
      externalId: 'relay-module',
      title: 'Tuya Smart Relay Module PCB bare board smart switch DIY',
      price: { amount: 8.00, currency: 'USD' },
      rating: 4.9,
      salesCount: 120,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'smart plug', page: 1 }]
    };

    const res5 = selectBestProduct([smartPlug, relayModule]);
    assert.strictEqual(res5.product!.externalId, 'valid-plug', 'Smart plug must outrank relay module');

    const motionLight = {
      id: 'motion-light',
      source: 'aliexpress' as const,
      externalId: 'motion-light',
      title: 'Motion Sensor Light Night Lamp Cabinet Wardrobe LED Light',
      price: { amount: 10.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 80,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'motion sensor light', page: 1 }]
    };

    const radarBoard = {
      id: 'radar-board',
      source: 'aliexpress' as const,
      externalId: 'radar-board',
      title: 'HLK-LD2410 Radar Sensor Board Module development board sensor component',
      price: { amount: 10.00, currency: 'USD' },
      rating: 4.9,
      salesCount: 80,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'motion sensor light', page: 1 }]
    };

    const res6 = selectBestProduct([motionLight, radarBoard]);
    assert.strictEqual(res6.product!.externalId, 'motion-light', 'Motion sensor light must outrank radar sensor board');

    const dollhouseRule = CLASSIFICATION_INVARIANTS.find(r => r.name.includes('Dollhouse'));
    assert.ok(dollhouseRule, 'Dollhouse invariant rule must exist');
    const invCheck1 = dollhouseRule.check({
      title: 'Dollhouse Plate',
      normalizedTitle: 'dollhouse plate',
      consumerReadinessLevel: 'high',
      productTypeValidity: 'valid',
      warnings: []
    });
    assert.strictEqual(invCheck1.violated, true, 'Dollhouse invariant must detect high readiness toy');

    const techRule = CLASSIFICATION_INVARIANTS.find(r => r.name.includes('Technical'));
    assert.ok(techRule, 'Technical invariant rule must exist');
    const invCheck2 = techRule.check({
      title: 'Tuya MCB',
      normalizedTitle: 'tuya mcb',
      consumerReadinessLevel: 'high',
      productTypeValidity: 'valid',
      warnings: ['circuit breaker']
    });
    assert.strictEqual(invCheck2.violated, true, 'Technical invariant must detect high readiness technical item');
  }

  // Test 16: Precedence, phrase-level relevance, unregulated overrides, selection eligibility
  {
    console.log('Test 16: Precedence, phrase-level relevance, unregulated overrides, selection eligibility');
    const { selectBestProduct, computeKeywordRelevance, CLASSIFICATION_INVARIANTS } = await import('../src/features/automation/product-selector');
    const { runScheduledProductDiscovery } = await import('../src/features/discovery/discovery-scheduler');

    const mixedPhoneCase = {
      id: 'mixed-case',
      source: 'aliexpress' as const,
      externalId: 'mixed-case',
      title: 'Lens Slide Camera Phone Case for Xiaomi Magnetic Ring Stand phone holder',
      price: { amount: 15.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 100,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'car phone holder', page: 1 }]
    };

    const resPrecedence = selectBestProduct([mixedPhoneCase]);
    const caseDetails = resPrecedence.rankedProducts?.[0];
    assert.ok(caseDetails, 'details must exist');
    assert.strictEqual(caseDetails.productTypeValidity, 'conflicting', 'Phone case + holder words remains conflicting');
    assert.strictEqual(caseDetails.selectionEligible, false, 'Conflicting product type must be ineligible for selection');

    const mixedReplacement = {
      id: 'mixed-replacement',
      source: 'aliexpress' as const,
      externalId: 'mixed-replacement',
      title: 'Replacement Pad Adhesive Plate for phone mount holder',
      price: { amount: 15.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 100,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'car phone holder', page: 1 }]
    };

    const resPrecedence2 = selectBestProduct([mixedReplacement]);
    const replacementDetails = resPrecedence2.rankedProducts?.[0];
    assert.ok(replacementDetails, 'details must exist');
    assert.strictEqual(replacementDetails.productTypeValidity, 'replacement', 'Replacement words override mount/holder words');
    assert.strictEqual(replacementDetails.selectionEligible, false, 'Replacement product type must be ineligible for selection');

    const genericPlugRelevance = computeKeywordRelevance('48V LCD Display Meter with SM Plug', 'smart plug');
    assert.notStrictEqual(genericPlugRelevance.relevanceLevel, 'high', 'Generic plug token alone cannot create high relevance');

    const unregulatedProd = {
      id: 'unregulated-prod',
      source: 'aliexpress' as const,
      externalId: 'unregulated-prod',
      title: 'General Electronic Gadget Charging Dock Station',
      price: { amount: 15.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 100,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'smart plug', page: 1 }]
    };

    const resUnregulated = selectBestProduct([unregulatedProd]);
    const unregulatedDetails = resUnregulated.rankedProducts?.[0];
    assert.ok(unregulatedDetails, 'details must exist');
    assert.strictEqual(unregulatedDetails.productTypeValidity, 'unregulated', 'Product type must be unregulated');
    assert.strictEqual(unregulatedDetails.consumerReadinessLevel, 'medium', 'Unregulated product readiness level must be capped at medium');
    assert.ok(!unregulatedDetails.reasons.includes('Broad usefulness or curiosity potential'), 'Unregulated product cannot receive the valid-product bonus');

    const lowReadinessBreaker = {
      id: 'breaker-eligibility',
      source: 'aliexpress' as const,
      externalId: 'breaker-eligibility',
      title: 'Tuya Smart Circuit Breaker MCB DIN Rail 63A Switch',
      price: { amount: 15.00, currency: 'USD' },
      rating: 4.8,
      salesCount: 100,
      imageUrl: 'img',
      productUrl: 'det',
      affiliateUrl: 'http://p',
      status: 'ready' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      origins: [{ strategyType: 'keyword', strategyValue: 'smart plug', page: 1 }]
    };

    const resBreaker = selectBestProduct([lowReadinessBreaker]);
    assert.strictEqual(resBreaker.rankedProducts?.[0].selectionEligible, false, 'Low-readiness products must be selection ineligible');

    const resAllIneligible = selectBestProduct([mixedPhoneCase, mixedReplacement, lowReadinessBreaker]);
    assert.strictEqual(resAllIneligible.product, null, 'Should return product: null when all candidates are ineligible');

    const originalDiscover = (await import('../src/features/discovery/discovery-service')).DiscoveryService.prototype.discover;
    (await import('../src/features/discovery/discovery-service')).DiscoveryService.prototype.discover = async function() {
      return {
        products: [],
        filteringResult: {
          eligible: [
            {
              product: {
                id: 'ineligible-mock',
                source: 'aliexpress' as const,
                externalId: 'ineligible-mock',
                title: 'Tuya Smart Circuit Breaker MCB DIN Rail 63A Switch',
                price: { amount: 15.00, currency: 'USD' },
                rating: 4.8,
                salesCount: 100,
                imageUrl: 'img',
                productUrl: 'det',
                affiliateUrl: 'http://p',
                status: 'ready' as const,
                createdAt: new Date(),
                updatedAt: new Date(),
                origins: [{ strategyType: 'keyword', strategyValue: 'smart plug', page: 1 }]
              },
              reasons: ['mocked']
            }
          ],
          rejected: []
        },
        stats: {
          strategiesExecuted: 1,
          apiRequestsMade: 1,
          rawProductsCollected: 1,
          uniqueProductsAfterDeduplication: 1,
          eligibleProductsCount: 1,
          rejectedProductsCount: 0,
          strategySummaries: []
        }
      } as any;
    };

    const schedulerRes = await runScheduledProductDiscovery(async () => false);
    assert.strictEqual(schedulerRes.success, true, 'Scheduler should succeed');
    assert.strictEqual(schedulerRes.status, 'no-products', 'Scheduler should return no products status');
    assert.strictEqual(schedulerRes.selectedProduct, undefined, 'Selected product must be undefined');

    (await import('../src/features/discovery/discovery-service')).DiscoveryService.prototype.discover = originalDiscover;
  }

  console.log('\nAll tests completed successfully!');
}

runTests().catch((err) => {
  console.error('\nTests failed:', err);
  process.exit(1);
});
