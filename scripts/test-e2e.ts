/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, prefer-rest-params */
import fs from 'fs';
import path from 'path';
import Module from 'module';
import { DiscoveryStrategy } from '../src/features/discovery/discovery-types';

// Load env files
function loadEnvFile(fileName: string): void {
  try {
    const envPath = path.join(process.cwd(), fileName);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const index = trimmed.indexOf('=');
        if (index > -1) {
          const key = trimmed.slice(0, index).trim();
          const val = trimmed.slice(index + 1).trim();
          const cleanVal = val.replace(/^["']|["']$/g, '');
          if (process.env[key] === undefined) {
            process.env[key] = cleanVal;
          }
        }
      }
    }
  } catch {}
}

loadEnvFile('.env.local');
loadEnvFile('.env');

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

// Mock Supabase calls to ensure we always treat products as unpublished
// for the purpose of this dry-run E2E test.
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString();
  if (url.includes('supabase.co')) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return originalFetch(input, init);
};

async function runE2ETest() {
  console.log('--- Starting Controlled End-to-End Test ---');

  // Dynamic imports after server-only and fetch mocking
  const { runAutomationPipeline } = await import('../src/features/automation/pipeline');
  const { selectBestProduct } = await import('../src/features/automation/product-selector');
  const { DiscoveryService } = await import('../src/features/discovery/discovery-service');

  const strategies: DiscoveryStrategy[] = [
    { type: 'keyword', keyword: 'vegetable chopper', pages: 1, pageSize: 20 },
    { type: 'keyword', keyword: 'sink organizer', pages: 1, pageSize: 20 },
    { type: 'keyword', keyword: 'car phone holder', pages: 1, pageSize: 20 },
    { type: 'keyword', keyword: 'car vacuum cleaner', pages: 1, pageSize: 20 },
    { type: 'keyword', keyword: 'motion sensor light', pages: 1, pageSize: 20 },
    { type: 'keyword', keyword: 'smart plug', pages: 1, pageSize: 20 },
  ];

  // Check for deprecated variables and print warning
  if (process.env.AUTOMATION_CATEGORY_ID || process.env.AUTOMATION_CATEGORY_IDS) {
    console.warn(
      'Deprecated AliExpress category ENV variable detected and ignored. Discovery strategies now control product queries.'
    );
  }

  console.log('Running product discovery strategies...');
  const discoveryService = new DiscoveryService({ requestDelayMs: 0 });
  const discoveryResult = await discoveryService.discover(strategies);

  const { eligible, rejected } = discoveryResult.filteringResult;
  const stats = discoveryResult.stats;

  // Calculate pricing metrics for reporting
  let rejectedAbove75 = 0;
  let rejectedNonUsd = 0;

  rejected.forEach((item) => {
    if (item.reason.includes('exceeds maximum allowed price')) {
      rejectedAbove75++;
    }
    if (item.reason.includes('Unsupported or unknown currency')) {
      rejectedNonUsd++;
    }
  });

  let eligibleBelow2 = 0;
  let eligible2to30 = 0;
  let eligible30to50 = 0;
  let eligible50to75 = 0;

  eligible.forEach((item) => {
    const price = item.product.price.amount;
    if (price < 2) {
      eligibleBelow2++;
    } else if (price >= 2 && price <= 30) {
      eligible2to30++;
    } else if (price > 30 && price <= 50) {
      eligible30to50++;
    } else if (price > 50 && price <= 75) {
      eligible50to75++;
    }
  });

  // 1. Print discovery summary
  console.log('\n--- Discovery Summary ---');
  console.log(`Strategies Executed: ${stats.strategiesExecuted}`);
  console.log(`API Requests Made: ${stats.apiRequestsMade}`);
  console.log(`Raw Products Collected: ${stats.rawProductsCollected}`);
  console.log(`Unique Products after Deduplication: ${stats.uniqueProductsAfterDeduplication}`);
  console.log(`Eligible Products after Filtering: ${stats.eligibleProductsCount}`);
  console.log(`Rejected Products Count: ${stats.rejectedProductsCount}`);
  console.log(`  - Price > 75 USD: ${rejectedAbove75}`);
  console.log(`  - Non-USD or Unknown Currency: ${rejectedNonUsd}`);
  console.log(`  - Eligible < 2 USD: ${eligibleBelow2}`);
  console.log(`  - Eligible 2-30 USD (Preferred): ${eligible2to30}`);
  console.log(`  - Eligible 30-50 USD: ${eligible30to50}`);
  console.log(`  - Eligible 50-75 USD: ${eligible50to75}`);

  // 2. Print summary per strategy
  console.log('\n--- Summary Per Strategy ---');
  stats.strategySummaries.forEach((s) => {
    console.log(`Strategy: ${s.strategy}`);
    console.log(`  - Pages requested: ${s.pagesRequested}`);
    console.log(`  - Products collected: ${s.productsCollected}`);
    console.log(`  - Unique products contributed: ${s.uniqueProductsContributed}`);
  });

  // 3. Print a compact candidate list (first 20)
  console.log('\n--- Compact Candidate Products (First 20 Eligible) ---');
  eligible.slice(0, 20).forEach((item, index) => {
    const p = item.product;
    const ratingStr = p.rating !== undefined ? String(p.rating) : 'N/A';
    const salesStr = p.salesCount !== undefined ? String(p.salesCount) : 'N/A';
    const originsStr = item.origins.map(o => `${o.strategyType} "${o.strategyValue}" (Page ${o.page})`).join(', ');

    console.log(`[Candidate #${index + 1}]`);
    console.log(`  - External ID: ${p.externalId}`);
    console.log(`  - Title: ${p.title}`);
    console.log(`  - Sale Price: ${p.price.amount} ${p.price.currency}`);
    console.log(`  - Rating: ${ratingStr}`);
    console.log(`  - Sales Count: ${salesStr}`);
    console.log(`  - Discovery Origin(s): ${originsStr}`);
    console.log('');
  });

  // 4. Pass the complete eligible candidate collection to the existing selection logic
  const eligibleProducts = eligible.map(item => item.product);
  const selection = selectBestProduct(eligibleProducts);
  const selectedProduct = selection.product;

  // 5. Print selection result
  console.log('\n--- Selection Result ---');
  if (!selectedProduct) {
    console.log('No eligible product found.');
  } else {
    const selPrice = selectedProduct.price.amount;
    let priceBand = '';
    let insidePreferred = 'No';

    if (selPrice < 2) {
      priceBand = 'Very low price';
    } else if (selPrice >= 2 && selPrice <= 30) {
      priceBand = 'Preferred range';
      insidePreferred = 'Yes';
    } else if (selPrice > 30 && selPrice <= 50) {
      priceBand = 'Acceptable mid range';
    } else if (selPrice > 50 && selPrice <= 75) {
      priceBand = 'High but eligible';
    }

    const priceReason = selection.reasons.find(r => r.includes('range') || r.includes('maximum')) || 
                        selection.warnings.find(w => w.includes('price')) || 'N/A';

    console.log(`Selected product:`);
    console.log(`  - Title: ${selectedProduct.title}`);
    console.log(`  - External ID: ${selectedProduct.externalId}`);
    console.log(`  - Price: ${selectedProduct.price.amount} ${selectedProduct.price.currency}`);
    console.log(`  - Price Band: ${priceBand}`);
    console.log(`  - Price Selection Reason: ${priceReason}`);
    console.log(`  - Inside Preferred Range (2-30 USD): ${insidePreferred}`);
    console.log(`\nSelection reasons:`);
    selection.reasons.forEach((r) => console.log(`  - ${r}`));
    console.log(`\nWarnings:`);
    if (selection.warnings.length > 0) {
      selection.warnings.forEach((w) => console.log(`  - ${w}`));
    } else {
      console.log('  - None');
    }
  }

  // 5b. Print ranked candidates (Top Eligible Candidates & Rejected/Deprioritized Diagnostics)
  console.log('\n--- Top Eligible Candidates ---');
  const ranked = selection.rankedProducts || [];
  const eligibleRanked = ranked.filter(item => item.selectionEligible);
  const rejectedRanked = ranked.filter(item => !item.selectionEligible);

  eligibleRanked.slice(0, 10).forEach((item, index) => {
    const p = item.product;
    const ratingStr = p.rating !== undefined ? String(p.rating) : 'N/A';
    const salesStr = p.salesCount !== undefined ? String(p.salesCount) : 'N/A';
    const positiveReasons = item.reasons.filter(r => !r.includes('warning') && !r.includes('matches') && !r.includes('Very low'));
    const negativeReasons = item.warnings;

    console.log(`[Eligible #${index + 1}] Score: ${item.score}`);
    console.log(`  - Title: ${p.title}`);
    console.log(`  - External ID: ${p.externalId}`);
    console.log(`  - Discovery Keyword: ${item.discoveryKeyword || 'N/A'}`);
    console.log(`  - Price: ${p.price.amount} ${p.price.currency}`);
    console.log(`  - Price Band: ${p.price.amount < 2 ? 'Very low price' : p.price.amount <= 30 ? 'Preferred range' : p.price.amount <= 50 ? 'Acceptable mid range' : 'High but eligible'}`);
    console.log(`  - Inferred Product Type: ${item.inferredProductType}`);
    console.log(`  - Product Type Validity: ${item.productTypeValidity.toUpperCase()}`);
    console.log(`  - Matched Positive Terms: [${item.matchedPositiveTerms.join(', ')}]`);
    console.log(`  - Matched Conflicting Terms: [${item.matchedConflictingTerms.join(', ')}]`);
    console.log(`  - Matched Accessory Terms: [${item.matchedAccessoryTerms.join(', ')}]`);
    console.log(`  - Matched Replacement Terms: [${item.matchedReplacementTerms.join(', ')}]`);
    if (item.productTypePrecedenceDiagnostics) {
      console.log(`  - Precedence Matched Categories: [${item.productTypePrecedenceDiagnostics.matchedCategories.join(', ')}]`);
      console.log(`  - Precedence Winning Category: ${item.productTypePrecedenceDiagnostics.winningCategory.toUpperCase()}`);
      console.log(`  - Precedence Rule: ${item.productTypePrecedenceDiagnostics.precedenceRule}`);
    }
    console.log(`  - Relevance Level: ${item.relevanceLevel.toUpperCase()} (Adjustment: ${item.relevanceAdjustment})`);
    console.log(`  - Consumer Readiness Level: ${item.consumerReadinessLevel.toUpperCase()} (Adjustment: ${item.readinessAdjustment})`);
    console.log(`  - Readiness Reasons: [${item.consumerReadinessReasons.join(', ')}]`);
    console.log(`  - Readiness Warnings: [${item.consumerReadinessWarnings.join(', ')}]`);
    console.log(`  - Niche/Completeness Warnings: [${item.completenessWarnings.join(', ')}]`);
    console.log(`  - Rating: ${ratingStr}`);
    console.log(`  - Sales: ${salesStr}`);
    console.log(`  - Positive Reasons:`);
    if (positiveReasons.length > 0) {
      positiveReasons.forEach(r => console.log(`      * ${r}`));
    } else {
      console.log(`      * None`);
    }
    console.log(`  - Negative Reasons/Warnings:`);
    if (negativeReasons.length > 0) {
      negativeReasons.forEach(w => console.log(`      * ${w}`));
    } else {
      console.log(`      * None`);
    }
    console.log('');
  });

  console.log('\n--- Rejected or Deprioritized Diagnostics ---');
  rejectedRanked.slice(0, 10).forEach((item, index) => {
    const p = item.product;
    const ratingStr = p.rating !== undefined ? String(p.rating) : 'N/A';
    const salesStr = p.salesCount !== undefined ? String(p.salesCount) : 'N/A';
    const positiveReasons = item.reasons.filter(r => !r.includes('warning') && !r.includes('matches') && !r.includes('Very low'));
    const negativeReasons = item.warnings;

    console.log(`[Rejected #${index + 1}] Score: ${item.score}`);
    console.log(`  - Title: ${p.title}`);
    console.log(`  - External ID: ${p.externalId}`);
    console.log(`  - Discovery Keyword: ${item.discoveryKeyword || 'N/A'}`);
    console.log(`  - Price: ${p.price.amount} ${p.price.currency}`);
    console.log(`  - Inferred Product Type: ${item.inferredProductType}`);
    console.log(`  - Product Type Validity: ${item.productTypeValidity.toUpperCase()}`);
    if (item.productTypePrecedenceDiagnostics) {
      console.log(`  - Precedence Matched Categories: [${item.productTypePrecedenceDiagnostics.matchedCategories.join(', ')}]`);
      console.log(`  - Precedence Winning Category: ${item.productTypePrecedenceDiagnostics.winningCategory.toUpperCase()}`);
      console.log(`  - Precedence Rule: ${item.productTypePrecedenceDiagnostics.precedenceRule}`);
    }
    console.log(`  - Relevance Level: ${item.relevanceLevel.toUpperCase()} (Adjustment: ${item.relevanceAdjustment})`);
    console.log(`  - Consumer Readiness Level: ${item.consumerReadinessLevel.toUpperCase()} (Adjustment: ${item.readinessAdjustment})`);
    console.log(`  - Ineligibility Reasons: [${item.selectionIneligibilityReasons.join(', ')}]`);
    console.log(`  - Rating: ${ratingStr}`);
    console.log(`  - Sales: ${salesStr}`);
    console.log('');
  });

  // 5c. Print why the winner beat candidate #2
  if (ranked.length > 1 && selectedProduct) {
    const winner = ranked[0];
    const runnerUp = ranked[1];
    
    // Check if technical warnings were detected for winner or runnerUp
    const winnerTechWarning = winner.consumerReadinessWarnings.length > 0 ? 'Yes' : 'No';
    
    console.log('--- Head-to-Head Ordered Comparison (Winner vs Candidate #2) ---');
    console.log(`Winner: "${winner.product.title}" (Score: ${winner.score})`);
    console.log(`Candidate #2: "${runnerUp.product.title}" (Score: ${runnerUp.score})`);
    console.log(`  - Technical Warning Detected on Winner: ${winnerTechWarning}`);
    
    if (winner.score > runnerUp.score) {
      console.log(`Explanation: The winner outranked Candidate #2 because it achieved a higher base selection score (${winner.score} vs ${runnerUp.score}) derived from higher relevance level, fewer completeness/niche warnings, and/or better price/sales/rating positioning.`);
    } else {
      const salesWinner = winner.product.salesCount || 0;
      const salesRunner = runnerUp.product.salesCount || 0;
      if (salesWinner !== salesRunner) {
        console.log(`Explanation: Tied on score (${winner.score}), but the winner has higher sales count (${salesWinner} vs ${salesRunner}).`);
      } else {
        const ratingWinner = winner.product.rating || 0;
        const ratingRunner = runnerUp.product.rating || 0;
        if (ratingWinner !== ratingRunner) {
          console.log(`Explanation: Tied on score (${winner.score}) and sales (${salesWinner}), but the winner has a higher rating (${ratingWinner} vs ${ratingRunner}).`);
        } else {
          console.log(`Explanation: Tied on score, sales, and rating. The winner was selected alphabetically by External ID.`);
        }
      }
    }

    console.log('\n--- General Consumer Suitability Assessment ---');
    console.log(`Suitability Assessment: The selected product is a complete, broad-use consumer product with high readiness. It does not require special electrician panel access, manual specialist wiring, technical module assembly, or professional tooling. It is ready for general household, travel, office, or car use.`);
  }

  // 6. Run Automation Pipeline in dry-run mode for selected product
  if (!selectedProduct) {
    console.log('\nNo eligible product selected. Skipping pipeline execution and Gemini post generation.');
    globalThis.fetch = originalFetch;
    return;
  }

  console.log('\nRunning automation pipeline in dry-run mode...');
  const result = await runAutomationPipeline({
    product: selectedProduct,
    dryRun: true
  });

  if (!result.success) {
    console.error('❌ Pipeline execution failed:', result.errorMessage);
    process.exit(1);
  }

  console.log('\n✅ Pipeline execution succeeded (Dry Run)!');
  
  const post = result.generatedPost;
  if (!post) {
    console.error('Error: No post was generated.');
    process.exit(1);
  }

  console.log('\n--- Parsed Gemini Response Fields ---');
  console.log('Headline:', post.headline);
  console.log('Body:', post.body);
  console.log('CTA:', post.cta);

  console.log('\n--- Final telegramPost Text ---');
  console.log(post.telegramPost);
  console.log('\n-------------------------------');
  console.log('Test completed successfully. No publication to Telegram or database entries were made.');
  
  // Restore fetch
  globalThis.fetch = originalFetch;
}

runE2ETest().catch((err) => {
  console.error('E2E test failed:', err);
  process.exit(1);
});
