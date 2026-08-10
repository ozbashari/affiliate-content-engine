# Real Search Result & Product Quality Audit (V2.1)

This audit evaluates the quality, purchase potential, and Click-Through Rate (CTR) potential of the actual products returned by the AliExpress API for our Discovery V2 library. It compares theoretical assumptions against live search results, diagnoses systemic bottlenecks in the selection pipeline, and proposes concrete, low-complexity MVP improvements.

---

## 1. Current Selection Pipeline

The product selection pipeline is divided into two distinct layers: **Hard Filters** (which discard invalid or out-of-bounds items) and **Ranking Signals** (which score and rank eligible candidates).

### Hard Filters (Eligibility Constraints)
A product is immediately rejected from the candidate pool if it fails any of the following checks in [discovery-filter.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/discovery/discovery-filter.ts) and [product-selector.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/automation/product-selector.ts):
1. **Missing Identifiers**: No `externalId` or empty `title`.
2. **Missing Media/Links**: No `imageUrl`, no `affiliateUrl` (or no raw `productUrl` to generate one).
3. **Price Safety**:
   - Price must be strictly greater than 0.
   - Currency must be `ILS` or `USD`.
   - Price must not exceed maximum thresholds: **280 ILS** ($75 USD).
4. **Type Conflicts (Only for 6 Core Intents)**: Conflicting product type matched (e.g. phone case for "car phone holder").
5. **Readiness Invariants**:
   - Low consumer readiness (e.g., contains developer board terms like `pcb`, `relay board`, high-amp electrical breakers, or professional installation terms).
   - Incomplete product/replacement component detected (e.g., matching replacement words like `nozzle only`, `filter only` inside core intent rules).
   - Toy/miniature indicators matched (e.g., `dollhouse`, `1:12 scale`).

> [!WARNING]
> There is **no minimum price hard filter** during initial discovery. Price below the preferred minimum (8 ILS / $2 USD) is treated as a ranking penalty (-15 points) rather than an eligibility block, allowing extremely cheap low-value components to sneak into selection.

### Ranking Signals (Scoring Logic)
Eligible candidates are scored on a baseline in [product-selector.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/automation/product-selector.ts#L412-L792):
* **Keyword Relevance**: High match (`reasons` and core terms present) = `+50`, Medium = `+10`.
* **Consumer Readiness**: High readiness = `+50`, Low readiness = `-150`.
* **Product Type Adjustment**: Replacement = `-100`, Conflicting = `-150`, Accessory = `-50`.
* **Functional Intent Override**: Keychain/pendant matching functional intent = `-80`.
* **Completeness Warning**: Toy/Merchandise/Incomplete part warning = `-100`.
* **Preferred Price Range**:
  - Price < Preferred Min (8 ILS / $2 USD) = `-15` (Penalty only, not a block).
  - Price in Preferred Range (8 - 110 ILS / 2 - 30 USD) = `+10` (Bonus).
  - Price in Mid-High Range (110 - 185 ILS / 30 - 50 USD) = `+5`.
  - Price in Maximum Range (185 - 280 ILS / 50 - 75 USD) = `-5`.
* **Trusted Brand**: Match brand (Baseus, Ugreen, Anker, etc.) = `+3`.
* **Rating**: Rating >= 4.6 = `+2`, Rating < 4.6 (or missing) = `-2`.
* **Sales Volume**: Orders >= 50 = `+2`, Orders > 0 = `+0`, Zero orders = `-1`.
* **Discount**: Discount between 10% and 80% = `+1`, Discount > 80% (suspicious) = `-1`.

---

## 2. Sampling Methodology

To test our theoretical "KEEP" classification, we ran a controlled sample querying the live AliExpress Affiliate API using [scratch_sample_aliexpress.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/scripts/scratch_sample_aliexpress.ts). 

We sampled **23 representative keywords** across high, medium, and low-weight categories, covering all theoretical audit verdicts (KEEP, IMPROVE, REPLACE, REMOVE) and inspected the actual products returned.

---

## 3. Real Result Analysis

Below is the analysis of the live API results for the 23 sampled keywords (the full JSON data is saved in [scratch_aliexpress_samples.json](file:///c:/Users/Oz/Desktop/affiliate_content_engine/scripts/scratch_aliexpress_samples.json)):

### Live API Output Summary Table

| Category | Keyword | Raw Results | Eligible Candidates | Selected Winner | Winner Price | Winner Sales | Score | Intent Match Quality |
|---|---|---|---|---|---|---|---|---|
| **Kitchen** | `bag sealer mini` | 20 | 19 | Folding Compressed Bag Electric Pump... | 58.06 ILS | 9 | 113 | **High** (Electric vacuum pump) |
| **Car** | `car vacuum cleaner wireless` | 20 | 15 | Powerful Wireless Portable Car Vacuum... | 72.5 ILS | 2 | 111 | **Medium** (Vacuum but very low sales) |
| **Car** | `seat gap filler organizer` | 20 | 19 | 2pcs Pair Universal Car Seat Gap Plug... | 43.15 ILS | 25 | 113 | **High** (Very visual car organizer) |
| **DIY** | `magnetic wristband for screws` | 20 | 20 | Magnetic Wristband for Holding Screws... | 34.06 ILS | 12237 | 15 | **High** (Outstanding utility tool) |
| **Travel** | `security door lock portable` | 20 | 20 | Portable Security Door Lock Travel... | 27.08 ILS | 163 | 65 | **High** (Practical hotel security) |
| **Pets** | `dog water bottle portable` | 20 | 20 | Outdoor Portable Dog Water Bottle... | 67.83 ILS | 736 | 115 | **High** (Visual pet travel bottle) |
| **Lighting** | `motion sensor light strip closet` | 20 | 20 | Wireless LED Strip Lights with Motion... | 33.51 ILS | 25 | 113 | **High** (USB rechargeable light bar) |
| **Organization** | `under sink organizer sliding` | 20 | 17 | 2 Tier Under Sink Organizer Pull Out... | 66.62 ILS | 9 | 20 | **High** (Functional sliding rack) |
| **Organization** | `cable clip organizer silicone` | 20 | 20 | Cable Clips Phone Cord Holder USB... | 22.65 ILS | 4423 | 92.8 | **Medium** (Boring commodity) |
| **Bathroom** | `toothpaste squeegee roller wall mount`| 0 | 0 | None (API failed to return results) | N/A | 0 | 0 | **None** |
| **Cleaning** | `micro fiber cleaning cloths` | 20 | 20 | 1-50Pcs Light Green Microfiber Towels | 24.28 ILS | 124 | 83.3 | **Low** (Boring commodity) |
| **DIY** | `super glue adhesive gel` | 20 | 20 | 15mL Gel Nail Glue for Rhinestones... | 23.93 ILS | 1823 | 94.1 | **Low** (Returned nail gel, not super glue) |
| **Office** | `gel pens set black blue` | 20 | 20 | Erasable Retractable Gel Pen Set... | 43.66 ILS | 9 | 100 | **Low** (Supermarket commodity) |
| **Laundry** | `clothespins pegs wooden plastic clamp`| 0 | 0 | None (API failed to return results) | N/A | 0 | 0 | **None** |
| **Car** | `scratch repair pen car` | 20 | 20 | Car Touch Up Paint Pen Universal... | 25.36 ILS | 924 | 93.7 | **Low** (Gimmick / high refund risk) |
| **Bicycle** | `valve adapter converter presta schrader`| 20 | 20 | Brass Bike Valve Adapter DV SV to AV... | 36.88 ILS | 1 | 111 | **Low** (Niche bicycle replacement part) |
| **Photography**| `step up ring filter step adapter` | 20 | 20 | Metal Step Up Rings Lens Adapter... | 26.05 ILS | 169 | 98.1 | **Low** (Professional camera part) |
| **Computer** | `thermal paste syringe CPU` | 20 | 19 | GD900 Heatsink Compound Grease Paste... | 19.56 ILS | 723 | 96.4 | **Low** (Niche computer assembly grease) |
| **Electronics**| `led tester detector backlight tester`| 20 | 18 | Automotive Car Voltage Detector Pen... | 100.4 ILS | 4 | 100 | **Low** (Niche professional tester tool) |
| **Emergency** | `emergency survival kit bag gear` | 20 | 19 | 3Pcs Emergency Sleeping Bag Kit... | 62.74 ILS | 2 | 100 | **Medium** (Useful thermal sleeping bag) |
| **Car** | `car phone holder` | 20 | 20 | 360 Degrees Magnetic Car Phone Holder | 14.02 ILS | 29 | 84 | **Medium** (Very saturated product) |
| **Home** | `essential oil diffuser ultrasonic` | 20 | 19 | KINSCOTER Wood Grain Diffuser 300ml... | 54.96 ILS | 55 | 87.1 | **High** (Visual aromatherapy humidifier) |
| **Emergency** | `first aid kit bag empty` | 20 | 20 | Empty Medical Bag Home Organizer... | 115.36 ILS | 2 | 0 | **Low** (Empty nylon bag for 115 ILS) |

---

## 4. Current Selector Hit Rate

Out of the 21 successful searches (excluding the 2 queries that failed to return any raw API results):
* **Strong Hits (High affiliate/CTR potential)**: **8 / 21 (38%)**
* **Decent/Mediocre Matches (Saturated/Boring)**: **4 / 21 (19%)**
* **Clear Misses (Niche parts, commodities, empty bags, gimmicks)**: **9 / 21 (43%)**

### Selector Hit Rate: **38%** (Strong Hits only) | **57%** (Acceptable baseline)
### Miss Rate: **43%**

### Why Misses Happen (Pipeline Gaps):
1. **Lack of Type Rules for Niche Categories**: Custom positive/negative rules in `productTypeRules` only exist for **6 keywords** (chopper, sprayer, sink organizer, phone holder, vacuum, motion light). For the other 594 keywords, there are **no type rules**. As a result, a tiny bicycle brass valve adapter (`valve adapter...`) or camera thread adapter (`step up ring...`) ranks just as high as a primary consumer product.
2. **Synonym Evasion**: The generic replacement/part checker filters words like `replacement` or `accessory only`. It cannot catch synonyms like `Converter`, `Grease`, `Detector Pen`, `Empty Bag`, or `Lens Adapter`, allowing niche replacement components to rank highly.
3. **No Order Threshold**: The pipeline does not require a minimum sales volume. The selected winner for `car vacuum cleaner wireless` had only 2 sales, and `first aid kit bag empty` had only 2 sales. This leads to selecting low-trust, newly-listed, or overpriced items.

---

## 5. Main Bottleneck Diagnosis

The biggest limitation on product quality is a **combination of C (Discovery Filters) and D (Product Selector)**.

```
[AliExpress API] 
  ↳ Returns 20 results (Highly diverse: some parts, some commodities, some good products)
      ↳ [Filters] (Bypassed! No minimum sales filter, no general replacement part block)
          ↳ [Selector] (Lacks structural type constraints for 594 keywords; ranks cheap parts/grease/empty bags equally)
              ↳ [Winner] (Often a 15 ILS replacement nut or empty bag with 1 sale)
```

- **Why it is not A (Keywords)**: The keywords themselves are decent in theory, but AliExpress is a marketplace of parts. If you search `valve adapter`, it returns exactly what you asked for—a replacement valve. If the application cannot identify that a valve is a replacement part, it will publish it.
- **Why it is not B (AliExpress Search)**: Search behaves as expected for a marketplace. It is the application's job to separate "consumer products" from "spare parts".

---

## 6. Strong-Product Patterns (Telegram Gold)
* **Visual Problem Solvers**: Self-contained products solving a physical friction point (sliding organizer, bag sealer).
* **Low-Friction Travel Safety**: Plug-and-play travel security devices (portable door lock).
* **Rechargeable Lighting**: Highly visual, modern rechargeable LED strips.

## 7. Weak-Product Patterns (Telegram Noise)
* **Replacement/Repair Parts**: Grease, converters, threads, adapters.
* **Supermarket Commodities**: Erasable pens, super glue, microfiber rags.
* **Empty Shells**: Red empty nylon pouches sold under the keyword "first aid kit".

---

## 8. Price/Value Findings
- **Excellent Impulse Range**: **15 - 60 ILS**. Highly active, requires zero consideration, cheap to ship.
- **Mediocre Pricing Trap**: Currently, the selector gives a `+10` bonus to any price between 8 and 110 ILS. Because cheap spare parts and commodities sit in the 8-30 ILS range, they receive the full bonus and easily outrank premium 60-100 ILS consumer products that have slightly lower sales counts.

---

## 9. Re-evaluating the 88% KEEP Verdict

The initial **88% KEEP** threshold from the theoretical audit is **unjustified**. 

Based on actual search results, at least **30% of the KEEP keywords** (niche tools, technical sensors, generic bags, and commodities) must be demoted, replaced, or removed because they return unacceptable candidates from the AliExpress search engine. The threshold should be lowered to **~55% KEEP**, with the rest aggressively replaced or refined.

---

## 10. Recommended Optimization Priority

We rank the expected optimization actions for our MVP stage:

| Priority | Action | Expected Impact | Complexity | Regression Risk |
|---|---|---|---|---|
| **1** | **Introduce Hard Minimum Sales Filter** (e.g. reject < 10 orders) | **High** | Low | Low |
| **2** | **Expand Global Replacement/Part Filter** (add `converter`, `adapter`, `grease`, `tester`, `detector`, `empty` to generic part warnings) | **High** | Low | Low |
| **3** | **Eliminate Niche/Replacement Keywords** (replace them with high-potential long-tail queries) | **High** | Low | Low |
| **4** | **Stricter Price Filters by Category** (set lower max limits for simple categories like phone accessories to prevent overpriced items) | **Medium** | Low | Low |
| **5** | **Prompts & System Instructions** (already updated) | **Medium** | Low | Low |

---

## 11. Proposed MVP Improvements

We recommend implementing the following **low-complexity, high-impact code tweaks** (without structural database or scheduler changes):

### A. Tweak Hard Filters in `discovery-filter.ts`
1. Add a **minimum sales volume constraint**: Reject any product with `salesCount !== undefined && salesCount < 10` to eliminate dead or overpriced listings.
2. Add a **minimum price constraint**: Reject any product with price below **8 ILS** ($2 USD) to prevent small replacement bolts or keychains from qualifying.

### B. Expand Incomplete/Part Warnings in `product-selector.ts`
Expand `partTerms` in `product-selector.ts` (around line 593) to globally catch common replacement part synonyms:
```typescript
const partTerms = [
  'replacement', 'spare', 'component', 'handle only', 'accessory only', 'knob', 'screw', 'clamp', 
  'cover only', 'adapter', 'converter', 'connector', 'grease', 'paste', 'tester', 'detector', 
  'empty bag', 'empty pouch', 'refill'
];
```
This single line change will instantly disqualify terms like `valve adapter DV SV to AV converter`, `thermal grease paste`, and `empty medical bag` from achieving high readiness scores!
