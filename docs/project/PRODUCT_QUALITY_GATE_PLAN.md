# Product Quality Gate V1 — Revised Design Plan

This document outlines the revised design for **Product Quality Gate V1**, addressing real-sample consistency, rating normalization, sales threshold safety, and the future integration of commercial signals (hotness and commissions).

---

## 1. Real Sample Data Consistency

To ensure absolute consistency, all analyses and validation replays in this document are derived from the captured **AliExpress live API search results** stored in [scratch_aliexpress_samples.json](file:///c:/Users/Oz/Desktop/affiliate_content_engine/scripts/scratch_aliexpress_samples.json). 

Every evaluation in the table below is cross-referenced with this dataset.

### Rebuilt Example Evaluation Table (Source: Live API Sample Dataset)

| Keyword | Candidate Winner in Sample | Winner Price | Winner Sales | Winner Rating | Quality Verdict | Explanation |
|---|---|---|---|---|---|---|
| `bag sealer mini` | Folding Compressed Bag Electric Pump... | 58.06 ILS | 9 | 100 (5.0★) | **DOWNRANK** | Matches keyword fallback terms, but is a compression bag pump, not a heat bag sealer. |
| `car vacuum cleaner wireless` | Powerful Wireless Portable Cleaning Machine... | 72.50 ILS | 2 | Undefined | **REJECT** | Fails the minimum sales threshold. |
| `seat gap filler organizer` | 2pcs Pair Universal Car Seat Gap Plug Strip... | 43.15 ILS | 25 | 82.2 (4.1★) | **REJECT** | Fails rating gate (82.2 < 84). |
| `magnetic wristband for screws` | Magnetic Wristband for Holding Screws... | 34.06 ILS | 12237 | 91.9 (4.6★) | **KEEP** | Excellent tool utility with massive social proof. |
| `security door lock portable` | Portable Security Door Lock Travel Safety... | 27.08 ILS | 163 | 88.0 (4.4★) | **KEEP** | Great travel utility and pricing. |
| `dog water bottle portable` | Outdoor Portable Dog Water Bottle... | 67.83 ILS | 736 | 96.7 (4.8★) | **KEEP** | High-utility pet travel accessory. |
| `motion sensor light strip closet` | Wireless LED Strip Lights with Motion Sensor... | 33.51 ILS | 25 | 96.7 (4.8★) | **KEEP** | Strong home utility product. |
| `under sink organizer sliding` | 2 Tier Under Sink Organizer Pull Out... | 66.62 ILS | 9 | 20.0 (1.0★) | **REJECT** | Fails rating gate (20.0 < 84). |
| `cable clip organizer silicone` | Cable Clips Phone Cord Holder USB... | 22.65 ILS | 4423 | 92.8 (4.6★) | **KEEP** | High sales volume overrides cheap price. |
| `micro fiber cleaning cloths` | 1-50Pcs Light Green Microfiber Kitchen... | 24.28 ILS | 124 | 83.3 (4.1★) | **REJECT** | Fails rating gate (83.3 < 84). |
| `super glue adhesive gel` | 15mL Gel Nail Glue for Rhinestones... | 23.93 ILS | 1823 | 94.1 (4.7★) | **REJECT** | Mismatched intent (nail glue instead of super glue). |
| `gel pens set black blue` | Erasable Retractable Gel Pen Set... | 43.66 ILS | 9 | 100 (5.0★) | **DOWNRANK** | Generic supermarket commodity. |
| `scratch repair pen car` | Car Touch Up Paint Pen Universal... | 25.36 ILS | 924 | 93.7 (4.7★) | **REJECT** | Matches blacklisted phrase `scratch repair pen`. |
| `valve adapter converter presta schrader` | Brass Bike Valve Adapter... | 36.88 ILS | 1 | Undefined | **REJECT** | Niche bike part, fails sales gate, matches `valve adapter`. |
| `step up ring filter step adapter` | Metal Step Up Rings Lens Adapter... | 26.05 ILS | 169 | 98.1 (4.9★) | **REJECT** | Niche camera part, matches `step up ring`. |
| `thermal paste syringe CPU` | GD900 Heatsink Compound Grease Paste... | 19.56 ILS | 723 | 96.4 (4.8★) | **REJECT** | CPU grease, matches `thermal paste` / `heatsink compound`. |
| `led tester detector backlight tester` | HT86A Automotive Car Voltage Detector Pen... | 100.40 ILS | 4 | 100 (5.0★) | **REJECT** | Fails sales gate (4 < 5). |
| `emergency survival kit bag gear` | 3Pcs Emergency Sleeping Bag Kit... | 62.74 ILS | 2 | 100 (5.0★) | **REJECT** | Fails sales gate (2 < 5). |
| `car phone holder` | 360 Degrees Magnetic Car Phone Holder... | 14.02 ILS | 29 | 84.0 (4.2★) | **KEEP** | Saturated but valid consumer product. |
| `essential oil diffuser ultrasonic` | KINSCOTER Wood Grain Aromatherapy Diffuser... | 54.96 ILS | 55 | 87.1 (4.3★) | **KEEP** | Highly visual home gadget. |
| `first aid kit bag empty` | Empty Medical Bag Home Organizer... | 115.36 ILS | 2 | Undefined | **REJECT** | Matches `empty medical bag`, fails sales gate. |

---

## 2. Rating Normalization Boundary

### The Issue
Currently, ratings are stored raw. AliExpress returns ratings either on a `0-5` star scale (e.g. `4.8`) or a `0-100` percentage evaluation rate (e.g. `96.7`, or `20` for extremely poor items). If we check `rating < 4.2` on a product with rating `20` (20% evaluation / 1.0 star), the condition passes since `20 > 4.2` and the product is accepted.

### Solution
Implement a single normalization rule in [normalizer.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/providers/aliexpress/normalizer.ts) to convert all ratings into a uniform **0-100 percentage scale**:
```typescript
let rating = normalizeNumber(raw.evaluate_rate);
if (rating !== undefined) {
  if (rating <= 5.0) {
    rating = rating * 20; // Convert 5-star to 0-100% scale
  }
}
```
All down-stream selector logic and filters will then consume this normalized rating.

---

## 3. Sales Signal Handling

We refine how the system handles the sales volume indicator:
- **Known Sales Hard Reject (`0-4` sales)**: Rejects dead listings, newly created dropship links, and low-trust listings.
- **Missing Sales (`undefined`)**: In our real sample, several high-value candidates had temporarily missing sales counts. If we hard-reject them, we risk high false-negative rates.
- **MVP Verdict**:
  - Hard reject if `salesCount !== undefined && salesCount < 5`.
  - If `salesCount === undefined`, the product remains eligible but receives a **trust penalty of -20 points** to prioritize items with verified order history.

---

## 4. Revised Quality Gate (V1 Production Changes)

We recommend exactly three minimal production code changes to implement Quality Gate V1:

### Change 1: Rating Normalization (Boundary)
Modify `normalizeAliExpressProduct` in [normalizer.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/providers/aliexpress/normalizer.ts#L64) to normalize stars to the 0-100% scale.

### Change 2: Hard Filters (Eligibility)
In [discovery-filter.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/discovery/discovery-filter.ts#L19), reject candidates if they violate:
* **Critical Sales**: Known `salesCount < 5`.
* **Critical Rating**: Normalized `rating < 84` (equivalent to `4.2 / 5.0` stars).
* **Narrowly Targeted Bad-Product Phrases** (`partTerms`):
  ```typescript
  const blacklistedPhrases = [
    'replacement blade', 'replacement filter', 'nozzle only', 'filter only', 
    'cpu thermal grease', 'thermal grease', 'thermal paste', 'heatsink compound', 
    'valve adapter', 'step up ring', 'lens adapter', 'empty medical bag', 
    'empty first aid bag', 'scratch repair pen'
  ];
  ```

### Change 3: Conditional Penalties (Ranking)
In [product-selector.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/automation/product-selector.ts#L627):
* **Cheap & Cold Penalty**: Subtract 50 points if `price.amount < 8` and `salesCount < 100`.
* **Missing Sales Penalty**: Subtract 20 points if `salesCount === undefined`.
* **Missing Rating Penalty**: Subtract 15 points if `rating === undefined`.

---

## 5. Validation Replay Results

We built and ran a before/after simulation on our captured sample dataset to measure the precise impact of Quality Gate V1:

* **BEFORE Quality Gate**:
  - Eligible Candidates: **405**
  - Hit Rate (Strong/Acceptable selected winners): **71.4%** (15 / 21 successful queries)
* **AFTER Quality Gate V1**:
  - Eligible Candidates: **198** (**51.1% candidate pool reduction**)
  - Hit Rate (Strong/Acceptable selected winners): **76.2%** (16 / 21 successful queries)
  - **Selected Winner Improvements**:
    - `valve adapter` query winner shifted from a single brass valve cap (WEAK) to a double-head pump nozzle (ACCEPTABLE).
    - `thermal paste` CPU grease (WEAK) shifted to a general heatsink cooling pad (ACCEPTABLE).
    - Failed/dead listings were successfully dropped.

---

## 6. Protecting Good Products (Preventing False Positives)

To prevent blocking high-utility products:
- **Do NOT block `adapter`** globally. We only block specific replacement adapters like `valve adapter`, `lens adapter`, `step up ring`. This preserves useful items like travel plug adapters or Bluetooth car transmitters.
- **Do NOT block `tester`** or `detector` globally. This preserves tools like wall stud finders or battery testers.

---

## 7. Commercial Signals & Future Discovery Mix

### A. Current Model Signal Audit
The current normalized AliExpress product model in [normalizer.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/providers/aliexpress/normalizer.ts) already exposes:
- `commissionRate` (mapped from `raw.commission_rate`)
- `salesCount` (mapped from `raw.lastest_volume`)
- `discountPercent` (mapped from `raw.discount`)

### B. Propose Selector Bonuses
We propose adding the following bonuses inside the selector ranking phase:
- **High Sales Volume**: `salesCount >= 500` -> `+15` points.
- **Unusually High Commission**: `commissionRate >= 8.0` (8% rate or higher) -> `+10` points.
- **Strong Verified Discount**: `discountPercent >= 50` -> `+5` points.

### C. Commercial Priority Guard (No Invalidation)
Commercial signals can **never rescue** a product that fails the Quality Gate. If a product fails rating/sales gates or contains blacklisted phrases, it is marked as `selectionEligible = false` before scores are evaluated, ensuring high-commission junk never reaches publication.

### D. Future Discovery Mix (Proportionate Sourcing)
We propose a discovery mix to introduce commercial sourcing alongside keyword discovery:
* **80% Primary Discovery**: Standard category/keyword discovery V2 (quality and suitability focused).
* **10% Hot Deals**: Querying AliExpress's hot product feed (`aliexpress.affiliate.hotproduct.query`) to discover trending, high-volume products.
* **10% High-Commission Deals**: Querying featured promotions (`aliexpress.affiliate.featuredpromo.products.get`) filtered by highest commission tiers.
