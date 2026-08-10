import { normalizeAliExpressProduct } from '../src/features/providers/aliexpress/normalizer';
import { filterProducts } from '../src/features/discovery/discovery-filter';
import { selectBestProduct } from '../src/features/automation/product-selector';
import { CatalogProduct } from '../src/features/products/types';
import fs from 'fs';
import path from 'path';

function normalizeRating(rating?: number): number | undefined {
  if (rating === undefined) return undefined;
  if (rating <= 5) return rating * 20;
  return rating;
}

// Define helper to create dummy product
function createDummyProduct(overrides: Partial<CatalogProduct>): CatalogProduct {
  return {
    id: 'aliexpress_test',
    source: 'aliexpress',
    externalId: 'test_123',
    title: 'Test Product standard name',
    imageUrl: 'https://example.com/image.jpg',
    productUrl: 'https://example.com/product',
    affiliateUrl: 'https://click.aliexpress.com/test',
    price: { amount: 15, currency: 'ILS' },
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: 90,
    salesCount: 50,
    commissionRate: 5.0,
    discountPercent: 10,
    origins: [{ strategyType: 'keyword', strategyValue: 'car phone holder', page: 1 }],
    ...overrides
  };
}

// Replay helper structures
interface Candidate {
  title: string;
  price: number;
  sales?: number;
  rating?: number;
}

interface Sample {
  category: string;
  keyword: string;
  rawCount: number;
  eligibleCount: number;
  winnerTitle: string;
  winnerPrice: string;
  winnerSales: number;
  winnerRating: number;
  candidates: Candidate[];
  error?: string;
}

function runTests() {
  console.log('=== RUNNING DETERMINISTIC QUALITY GATE TESTS ===');
  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, message?: string) {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} ${message ? '- ' + message : ''}`);
      failed++;
    }
  }

  // 1. 5-star rating converts correctly to normalized percentage
  const p1 = normalizeAliExpressProduct({
    product_id: '123',
    product_title: 'Title',
    product_main_image_url: 'img',
    product_detail_url: 'url',
    evaluate_rate: '4.8',
    target_currency: 'ILS'
  });
  assert('5-star rating converts correctly (4.8 -> 96%)', p1.rating === 96);

  // 2. Percentage rating remains correct
  const p2 = normalizeAliExpressProduct({
    product_id: '123',
    product_title: 'Title',
    product_main_image_url: 'img',
    product_detail_url: 'url',
    evaluate_rate: '92.5%',
    target_currency: 'ILS'
  });
  assert('Percentage rating remains correct (92.5% -> 92.5)', p2.rating === 92.5);

  // 3. Rating 83.9 is rejected
  const p3 = createDummyProduct({ rating: 83.9 });
  const f3 = filterProducts([{ product: p3, origins: [] }]);
  assert('Rating 83.9 is rejected by filterProducts', f3.eligible.length === 0);

  // 4. Rating 84 is eligible
  const p4 = createDummyProduct({ rating: 84 });
  const f4 = filterProducts([{ product: p4, origins: [] }]);
  assert('Rating 84 is eligible under filterProducts', f4.eligible.length === 1);

  // 5. Known sales 4 is rejected
  const p5 = createDummyProduct({ salesCount: 4 });
  const f5 = filterProducts([{ product: p5, origins: [] }]);
  assert('Known sales 4 is rejected', f5.eligible.length === 0);

  // 6. Known sales 5 is eligible
  const p6 = createDummyProduct({ salesCount: 5 });
  const f6 = filterProducts([{ product: p6, origins: [] }]);
  assert('Known sales 5 is eligible', f6.eligible.length === 1);

  // 7. Missing sales remains eligible with penalty
  const p7 = createDummyProduct({ salesCount: undefined });
  const f7 = filterProducts([{ product: p7, origins: [] }]);
  assert('Missing sales remains eligible in filterProducts', f7.eligible.length === 1);
  const s7 = selectBestProduct([p7]);
  const score7 = s7.rankedProducts?.[0]?.score ?? 0;
  // Let's check if score contains the -20 penalty. Baseline is relevance + readiness = 100.
  // Missing rating: none (rating 90 is defined). Missing sales: -20.
  assert('Missing sales receives penalty (-20 points)', score7 < 100);

  // 8. Missing rating remains eligible with penalty
  const p8 = createDummyProduct({ rating: undefined });
  const f8 = filterProducts([{ product: p8, origins: [] }]);
  assert('Missing rating remains eligible in filterProducts', f8.eligible.length === 1);
  const s8 = selectBestProduct([p8]);
  const score8 = s8.rankedProducts?.[0]?.score ?? 0;
  assert('Missing rating receives penalty (-15 points)', score8 < 100);

  // 9. Cheap + low-sales product receives penalty
  const p9 = createDummyProduct({ price: { amount: 5, currency: 'ILS' }, salesCount: 10 });
  const s9 = selectBestProduct([p9]);
  const score9 = s9.rankedProducts?.[0]?.score ?? 0;
  // Cheap penalty: -50, low-price rating penalty: -15.
  assert('Cheap + low-sales product receives score penalty', score9 < 50);

  // 10. Cheap + high-sales product is preserved (no cheap penalty)
  const p10 = createDummyProduct({ price: { amount: 5, currency: 'ILS' }, salesCount: 500 });
  const s10 = selectBestProduct([p10]);
  const score10 = s10.rankedProducts?.[0]?.score ?? 0;
  // Should not have the -50 cheap penalty. Should have high sales bonus +15.
  assert('Cheap + high-sales product does not receive cheap & cold penalty', score10 - score9 >= 50, `score9: ${score9}, score10: ${score10}`);

  // 11. Narrow replacement/part phrase is rejected
  const p11 = createDummyProduct({ title: 'Universal CPU thermal grease syringe paste' });
  const f11 = filterProducts([{ product: p11, origins: [] }]);
  assert('Narrow replacement phrase in title is rejected', f11.eligible.length === 0);

  // 12. Generic "adapter", "tester", "detector" alone are NOT globally rejected
  const p12 = createDummyProduct({ title: 'Premium Bluetooth audio receiver adapter' });
  const f12 = filterProducts([{ product: p12, origins: [] }]);
  assert('Generic adapter alone is not rejected', f12.eligible.length === 1);

  // 13. High commission cannot rescue an ineligible product
  const p13 = createDummyProduct({ salesCount: 2, commissionRate: 20.0 }); // fails sales < 5
  const s13 = selectBestProduct([p13]);
  assert('High commission cannot rescue product with < 5 sales', s13.product === null);

  // 14. High sales cannot rescue an ineligible product
  const p14 = createDummyProduct({ rating: 50, salesCount: 10000 }); // fails rating < 84
  const s14 = selectBestProduct([p14]);
  assert('High sales cannot rescue product with low rating', s14.product === null);

  // 15. Commercial bonuses only affect ranking among already eligible products
  const p15a = createDummyProduct({ id: 'p15a', title: 'Product A', commissionRate: 5.0 });
  const p15b = createDummyProduct({ id: 'p15b', title: 'Product B', commissionRate: 15.0 }); // gets +10 bonus
  const s15 = selectBestProduct([p15a, p15b]);
  assert('Commercial bonus boosts product ranking', s15.product?.id === 'p15b');

  // 16. Case A: dog water bottle portable - real bottle outranks pet shower head
  const p16a = createDummyProduct({
    id: 'p16a_bottle',
    title: 'Portable Dog Cat Water Bottle with Storage Food and Water Container',
    price: { amount: 60.77, currency: 'ILS' },
    salesCount: 1182,
    rating: 96,
    origins: [{ strategyType: 'keyword', strategyValue: 'dog water bottle portable', page: 1 }]
  });
  const p16b = createDummyProduct({
    id: 'p16b_shower',
    title: 'Pet Shower Silicone Portable Pet Shower Head Cleaning Supplies Portable Universal Water Bottle',
    price: { amount: 36.79, currency: 'ILS' },
    salesCount: 167,
    rating: 96,
    origins: [{ strategyType: 'keyword', strategyValue: 'dog water bottle portable', page: 1 }]
  });
  const s16 = selectBestProduct([p16a, p16b]);
  assert('Case A: Dog water bottle outranks pet shower head', s16.product?.id === 'p16a_bottle');

  // 17. Case B: bag sealer mini - heat bag sealer outranks vacuum/compression pump
  const p17a = createDummyProduct({
    id: 'p17a_sealer',
    title: 'Mini Hea Bag Seal Machine Package Sealer Bags Thermal Plastic Food Bag',
    price: { amount: 23.79, currency: 'ILS' },
    salesCount: 47,
    rating: 84,
    origins: [{ strategyType: 'keyword', strategyValue: 'bag sealer mini', page: 1 }]
  });
  const p17b = createDummyProduct({
    id: 'p17b_pump',
    title: 'Folding Compressed Bag Electric Pump Travel Vacuum Bag Pump Mini',
    price: { amount: 58.06, currency: 'ILS' },
    salesCount: 9,
    rating: 84,
    origins: [{ strategyType: 'keyword', strategyValue: 'bag sealer mini', page: 1 }]
  });
  const s17 = selectBestProduct([p17a, p17b]);
  assert('Case B: Heat bag sealer outranks vacuum pump', s17.product?.id === 'p17a_sealer');

  // 18. Case C: high-commission but weak-relevance product never outranks Tier 1 direct-intent product
  const p18a = createDummyProduct({
    id: 'p18a_direct',
    title: 'Puppy Water Bottle For Small Medium Large Dogs Cat Travel Portable',
    price: { amount: 51.94, currency: 'ILS' },
    salesCount: 116,
    commissionRate: 5.0,
    origins: [{ strategyType: 'keyword', strategyValue: 'dog water bottle portable', page: 1 }]
  });
  const p18b = createDummyProduct({
    id: 'p18b_commission',
    title: 'Pet Silicone Shower Head and Accessories',
    price: { amount: 36.79, currency: 'ILS' },
    salesCount: 167,
    commissionRate: 25.0, // huge commission
    origins: [{ strategyType: 'keyword', strategyValue: 'dog water bottle portable', page: 1 }]
  });
  const s18 = selectBestProduct([p18a, p18b]);
  assert('Case C: High-commission weak-relevance product does not beat Tier 1 direct-intent', s18.product?.id === 'p18a_direct');

  // 19. Case D: massive-sales commodity must not beat a much more relevant product solely because of sales
  const p19a = createDummyProduct({
    id: 'p19a_direct',
    title: 'Puppy Water Bottle For Small Medium Large Dogs Cat Travel Portable',
    price: { amount: 51.94, currency: 'ILS' },
    salesCount: 10,
    origins: [{ strategyType: 'keyword', strategyValue: 'dog water bottle portable', page: 1 }]
  });
  const p19b = createDummyProduct({
    id: 'p19b_commodity',
    title: '10 Pack Microfiber Cleaning Cloth Sponge',
    price: { amount: 15.00, currency: 'ILS' },
    salesCount: 10000, // massive sales
    origins: [{ strategyType: 'keyword', strategyValue: 'dog water bottle portable', page: 1 }]
  });
  const s19 = selectBestProduct([p19a, p19b]);
  assert('Case D: Massive-sales commodity does not beat direct-intent product', s19.product?.id === 'p19a_direct');

  // 20. Case E: keyword-stuffed title - late occurrence of core intent reduces Tier 1 -> Tier 2 but remains eligible
  const p20 = createDummyProduct({
    id: 'p20_stuffed',
    title: 'Pet Shower Silicone Portable Pet Shower Head Cleaning Supplies Portable Universal Water Bottle',
    price: { amount: 36.79, currency: 'ILS' },
    salesCount: 167,
    origins: [{ strategyType: 'keyword', strategyValue: 'dog water bottle portable', page: 1 }]
  });
  const scored20 = selectBestProduct([p20]).rankedProducts?.[0];
  assert('Case E: Late match reduces relevance level to medium', scored20?.relevanceLevel === 'medium');
  assert('Case E: Late match product remains eligible', scored20?.selectionEligible === true);

  // 21. Case F: missing sales/rating - should receive penalty but remain eligible
  const p21 = createDummyProduct({
    id: 'p21_missing',
    title: 'Puppy Water Bottle For Small Medium Large Dogs Cat Travel Portable',
    price: { amount: 51.94, currency: 'ILS' },
    salesCount: undefined,
    rating: undefined,
    origins: [{ strategyType: 'keyword', strategyValue: 'dog water bottle portable', page: 1 }]
  });
  const scored21 = selectBestProduct([p21]).rankedProducts?.[0];
  assert('Case F: Missing sales/rating product remains eligible', scored21?.selectionEligible === true);
  assert('Case F: Missing sales/rating product receives penalties (score < 200)', (scored21?.score ?? 0) < 200);

  console.log(`\n=== TESTS COMPLETE: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

// Replay simulation logic
function runReplay() {
  const jsonPath = path.join(process.cwd(), 'scripts', 'aliexpress_samples.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('Sample JSON file not found for replay.');
    return;
  }

  const samples: Sample[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  let totalKeywords = 0;
  let beforeHits = 0;
  let afterHits = 0;
  let beforeEligibleTotal = 0;
  let afterEligibleTotal = 0;
  const rejectedReport: string[] = [];
  const downrankedReport: string[] = [];

  console.log('\n=== RUNNING FIXED SAMPLE QUALITY GATE REPLAY ===');

  for (const sample of samples) {
    if (sample.error) continue;
    totalKeywords++;

    // Reconstruct catalog products from the candidates list
    const catalogCandidates = sample.candidates.map((c, i) => {
      return createDummyProduct({
        id: `c_${i}`,
        title: c.title,
        price: { amount: c.price, currency: 'ILS' },
        salesCount: c.sales,
        rating: normalizeRating(c.rating),
        discountPercent: 10,
        commissionRate: 5.0
      });
    });

    beforeEligibleTotal += catalogCandidates.length;

    // Filter using filterProducts (the Quality Gate)
    const uniqueDiscovered = catalogCandidates.map(c => ({ product: c, origins: [] }));
    const filtered = filterProducts(uniqueDiscovered);
    const eligibleAfter = filtered.eligible.map(e => e.product);
    afterEligibleTotal += eligibleAfter.length;

    // Log rejected products
    filtered.rejected.forEach(r => {
      rejectedReport.push(`[${sample.keyword}] Rejected: "${r.product.product.title.slice(0, 40)}..." (Reason: ${r.reason})`);
    });

    // Run selectors
    const beforeSelection = selectBestProduct(catalogCandidates);
    const afterSelection = selectBestProduct(eligibleAfter);

    const winnerBefore = beforeSelection.product;
    const winnerAfter = afterSelection.product;

    // Evaluate Quality
    const evaluateProductQuality = (title: string): 'STRONG' | 'ACCEPTABLE' | 'WEAK' => {
      const tl = title.toLowerCase();
      
      const badTerms = [
        'microfiber', 'cloth', 'glue', 'gel pen', 'clothespin', 'peg', 'scratch repair',
        'valve adapter', 'step up ring', 'thermal grease', 'thermal paste', 'backlight tester',
        'empty'
      ];
      if (badTerms.some(t => tl.includes(t))) return 'WEAK';
      
      return 'STRONG';
    };

    const qualityBefore = winnerBefore ? evaluateProductQuality(winnerBefore.title) : 'WEAK';
    const qualityAfter = winnerAfter ? evaluateProductQuality(winnerAfter.title) : 'WEAK';

    if (qualityBefore === 'STRONG') beforeHits++;
    if (qualityAfter === 'STRONG') afterHits++;

    // Track downranked winners
    if (winnerBefore && winnerAfter && winnerBefore.id !== winnerAfter.id) {
      downrankedReport.push(`[${sample.keyword}] Winner changed: "${winnerBefore.title.slice(0, 45)}..." -> "${winnerAfter.title.slice(0, 45)}..."`);
    }
  }

  const beforeHitRate = ((beforeHits / totalKeywords) * 100).toFixed(1);
  const afterHitRate = ((afterHits / totalKeywords) * 100).toFixed(1);
  const reduction = (((beforeEligibleTotal - afterEligibleTotal) / beforeEligibleTotal) * 100).toFixed(1);

  console.log('\n--- BEFORE VS AFTER SUMMARY ---');
  console.log(`- Eligible Candidates: Before: ${beforeEligibleTotal} | After: ${afterEligibleTotal} (Reduced by ${reduction}%)`);
  console.log(`- Hit Rate (Strong Winners): Before: ${beforeHitRate}% (${beforeHits}/${totalKeywords}) | After: ${afterHitRate}% (${afterHits}/${totalKeywords})`);
  
  console.log(`\nReplay evaluation is complete.`);
}

runTests();
runReplay();
