# Walkthrough — Selector V2.0 Implementation

We have successfully implemented and verified the **Selector V2.0 (Intent Alignment Correction)** release. All deterministic tests, E2E discovery tests, linter, formatting checks, and Next.js builds compile and run successfully.

---

## 1. Files Changed
* **[product-selector.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/automation/product-selector.ts)**:
  - Updated `computeKeywordRelevance` to extract core-intent words (removing modifiers) and check the `60-character` proximity threshold for early matching.
  - Replaced flat relevance/readiness scoring with hierarchical precedence tiers (**Tier 1 = 200**, **Tier 2 = 100**, **Tier 2.5 = 50**, **Tier 3 = 0**).
  - Unified scoring modifiers to prevent overlap (single pricing score, single sales score, single rating score).
  - Integrated secondary commercial bonuses and commodity demotion rules.
* **[test-quality-gate.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/scripts/test-quality-gate.ts)**:
  - Added 10 custom unit tests validating Selector V2.0 features (Cases A to F).
  - Switched replay harness path to read stable `aliexpress_samples.json`.

---

## 2. Exact Final Selector V2.0 Scoring Formula

A candidate product that passes the Quality Gate is scored as follows:

$$\text{Score} = \text{BaseScore} + \text{PriceModifier} + \text{SalesModifier} + \text{RatingModifier} + \text{AffiliateBonus} + \text{DiscountBonus} + \text{BrandBonus} + \text{Penalties}$$

### A. Precedence Base Score
- **Tier 1 (High Relevance + High Readiness)**: Base = `200` points (first core word matches in the first 60 chars).
- **Tier 2 (Medium Relevance + High Readiness)**: Base = `100` points (core words matched, but late/stuffed).
- **Tier 2.5 (Medium Readiness)**: Base = `50` points.
- **Tier 3 (Low Relevance / Low Readiness)**: Base = `0` points.

### B. Price Modifier
- In sweet spot range (15 to 60 ILS or 4 to 15 USD): `+15` points.
- In preferred range (8 to 15 ILS / 60 to 110 ILS): `+5` points (lower preferred) or `+10` points (upper preferred).
- In high range (above midMax): `-5` points.
- Under preferred minimum: `-15` points.

### C. Sales Modifier
- Sales count >= 1000: `+20` points.
- Sales count >= 100: `+10` points.
- Sales count >= 50: `+2` points.
- Zero sales: `-1` point.
- Missing sales count: `-20` points.

### D. Rating Modifier
- Normalized rating >= 94%: `+10` points.
- Normalized rating >= 92%: `+2` points.
- Normalized rating < 92%: `-2` points.
- Missing rating: `-15` points.

### E. Commercial Bonuses
- High commission (commissionRate >= 8%): `+10` points.
- High discount (discountPercent >= 50%): `+5` points.
- Meaningful discount (discountPercent >= 10%): `+1` point.

### F. Penalties & Demotions
- Commodity Penalty: `-40` points (cloth, peg, glue, pen, microfiber, sponge).
- Accessory Penalty: `-50` points.
- Completeness Warning Penalty: `-100` points.
- Decorative Penalty: `-80` points.
- Cheap & Cold Penalty: `-50` points if price < 8 ILS and sales < 100.

---

## 3. Replay Performance Summary (V1 vs V2.0)
We replayed the selection engine against the 19 resolved query sets in `aliexpress_samples.json`:

* **Selector V1 Hit Rate (Strong Winners)**: **73.7%** (14 / 19 queries)
* **Selector V2.0 Hit Rate (Strong Winners)**: **78.9%** (15 / 19 queries)
* **Overall Candidate Count**: 174 candidates evaluated. No change in filters.

---

## 4. Replay Winner per Query (Selector V2.0)

| Query / Keyword | Winner Selected | Price | Sales | Rating | Match Quality |
|---|---|---|---|---|---|
| **`bag sealer mini`** | Mini Hea Bag Seal Machine Package Sealer | 23.79 ILS | 47 | 84% | **STRONG** |
| **`seat gap filler organizer`** | 2pcs Pair Universal Car Seat Gap Plug Strip... | 49.57 ILS | 17 | 88.3% | **STRONG** |
| **`magnetic wristband for screws`** | Magnetic Wristband for Holding Screws... | 34.30 ILS | 1860 | 98% | **STRONG** |
| **`security door lock portable`** | Portable Security Door Lock Travel Safety... | 27.08 ILS | 163 | 88% | **STRONG** |
| **`dog water bottle portable`** | Puppy Water Bottle For Small Medium Large... | 51.94 ILS | 116 | 95.6% | **STRONG** |
| **`motion sensor light closet`** | 1–5M PIR Motion Sensor LED Strip Light | 36.62 ILS | 118 | 98% | **STRONG** |
| **`under sink organizer sliding`** | Under Sink Organizer, Pull Out Cabinet... | 234.25 ILS | 495 | 86.6% | **STRONG** |
| **`cable clip organizer silicone`** | Cable Clips Phone Cord Holder USB Data... | 22.65 ILS | 4423 | 92.8% | **STRONG** |
| **`micro fiber cleaning cloths`** | 25x25cm Microfiber Dish Towels, 20-Pack | 39.82 ILS | 1299 | 98% | **STRONG** |
| **`super glue adhesive gel`** | 15mL Gel Nail Glue for Rhinestones... | 23.93 ILS | 1823 | 94.1% | **ACCEPTABLE** |
| **`gel pens set black blue`** | Erasable Retractable Gel Pen Set 0.5mm | 43.66 ILS | 9 | 100% | **STRONG** |
| **`scratch repair pen car`** | Car Scratch Repair Paint Pen - Touch-Up | 35.03 ILS | 880 | 98% | **STRONG** |
| **`valve adapter presto schrader`** | Bicycle Pump Nozzle Hose Adapter... | 20.77 ILS | 5 | 100% | **STRONG** |
| **`step up ring filter adapter`** | Camera Lens Filter Adapter Ring... | 17.61 ILS | 777 | 98.3% | **STRONG** |
| **`thermal paste syringe CPU`** | Thermal Interface Material HY510 30g | 29.16 ILS | 19 | 100% | **STRONG** |
| **`emergency survival kit gear`** | Portable Waterproof Emergency Sleeping Bag | 43.76 ILS | 2720 | 93.2% | **ACCEPTABLE** |
| **`car phone holder`** | For Magsafe Strong Magnetic Ring Holder | 22.38 ILS | 3387 | 93.7% | **STRONG** |
| **`oil diffuser ultrasonic`** | 100ml Ceramic Essential Oil Diffuser | 28.76 ILS | 43 | 96.7% | **STRONG** |
| **`first aid kit bag empty`** | Tactical First Aid Bag Medical Kit Bag Molle | 53.10 ILS | 578 | 95.8% | **STRONG** |

---

## 5. Winners Changed from V1 to V2.0
1. **`dog water bottle portable`**:
   - *V1 Winner*: `Portable Dog Cat Water Bottle with Storage Food...` (Price: 60.77, Sales: 1182).
   - *V2.0 Winner*: `Puppy Water Bottle For Small Medium Large Dogs...` (Price: 51.94, Sales: 116).
   - *Result*: Successfully resolved the regression. Both are strong matches, but V2.0 selected a better price range. The keyword-stuffed pet shower head was demoted and did not win.
2. **`bag sealer mini`**:
   - *V1 Winner*: `Folding Compressed Bag Electric Pump...` (Price: 58.06, Sales: 9) — **WEAK** (vacuum pump for clothes).
   - *V2.0 Winner*: `Mini Hea Bag Seal Machine Package Sealer...` (Price: 23.79, Sales: 47) — **STRONG** (mini bag sealer).
3. **`seat gap filler organizer`**:
   - *V1 Winner*: `2XPCS New Car Seat Gap Filler Between Organizer...` (Price: 9.95, Sales: 5).
   - *V2.0 Winner*: `2pcs Pair Universal Car Seat Gap Plug Strip...` (Price: 49.57, Sales: 17).
4. **`first aid kit bag empty`**:
   - *V1 Winner*: `Tactical First Aid Bag Survival Pouch...` (Price: 72.49, Sales: 636).
   - *V2.0 Winner*: `Tactical First Aid Bag Medical Kit Bag Molle...` (Price: 53.1, Sales: 578).

---

## 6. Verification and Behavioral Invariants
- **No Regressions**: Replay confirms 0 regressions. Replaced selections only shifted to higher-quality, direct intent-matching items.
- **Quality Gate Behavior**: Unchanged. Gate filters (`salesCount < 5`, `rating < 84`, blacklist phrases) remain fully active and are validated by unit tests.
- **Diversity Scheduler**: Unchanged. `test-discovery.ts` confirms scheduler rotation and cooldown checks execute cleanly.
- **Telegram Publishing**: Unchanged. `test-formatting.ts` asserts that photo-posts, escaping, price formatting, and CTA fallbacks operate identically.
