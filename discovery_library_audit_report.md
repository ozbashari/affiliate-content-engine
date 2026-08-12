# Discovery Library V2.1 — Audit & Design Report

This report presents the audit of our existing 600-keyword Discovery V2 library and proposes the design of **Discovery Library V2.1**, optimized for an Israeli Telegram affiliate deals channel.

---

## 1. Current Library Health Summary (Task 1)

The current V2 library consists of **30 categories** with exactly **20 keywords each (600 total)**. While the category coverage is broad, the equal/symmetric distribution introduces high noise because several categories naturally produce low-value commodities or technical components.

Below is the category-level health assessment based on likely quality, commodity risk, accessory/replacement risk, visual/demo potential, problem-solving potential, and impulse-buy potential:

| Category | Key Count | Likely Quality | Commodity Risk | Accessory Risk | Visual Potential | Problem Solving | Impulse Buy | Class. / Action |
|---|---|---|---|---|---|---|---|---|
| **Kitchen Gadgets** | 20 | High | Low | Low | High | High | High | **KEEP / EXPAND** |
| **Car Accessories** | 20 | High | Low | Low | Medium | High | High | **KEEP / EXPAND** |
| **Home Decor & Utility** | 20 | Medium | Medium | Low | High | Medium | Medium | **KEEP** |
| **Cleaning Tools** | 20 | High | Medium | Low | High | High | High | **KEEP** |
| **Home Organization** | 20 | High | Low | Low | High | High | High | **KEEP / EXPAND** |
| **DIY & Crafting** | 20 | Medium | High | High | Medium | High | Low | **IMPROVE / SHRINK** |
| **Travel Accessories** | 20 | High | Low | Low | Medium | High | High | **KEEP** |
| **Camping Gear** | 20 | High | Low | Low | Medium | High | Medium | **KEEP** |
| **Pet Accessories** | 20 | High | Low | Low | High | High | High | **KEEP** |
| **Phone Gadgets** | 20 | Low | High | High | Low | Low | High | **SHRINK** |
| **Computer Accessories** | 20 | Low | High | High | Low | Low | Low | **SHRINK** |
| **Office Supplies** | 20 | Low | High | Low | Low | Low | Low | **SHRINK** |
| **Utility Lighting** | 20 | High | Low | Low | High | High | High | **KEEP / EXPAND** |
| **Garden Tools** | 20 | Medium | Medium | Medium | Medium | High | Low | **SHRINK** |
| **Bathroom Utility** | 20 | High | Low | Low | High | High | High | **KEEP** |
| **Laundry Helpers** | 20 | Medium | High | Low | Medium | High | Medium | **SHRINK** |
| **Coffee Gadgets** | 20 | High | Low | High | High | High | Medium | **SHRINK** |
| **Baby Safety & Care** | 20 | Medium | Medium | Low | Low | High | Low | **SHRINK** |
| **Kids Toys & Activity**| 20 | Medium | Low | Low | High | Low | Medium | **SHRINK** |
| **Fitness Accessories**| 20 | Low | High | High | Medium | Low | Low | **SHRINK** |
| **Bicycle Gear** | 20 | Low | High | High | Low | Medium | Low | **SHRINK** |
| **BBQ Utilities** | 20 | Medium | Medium | Low | Medium | Medium | Low | **SHRINK** |
| **Home Storage** | 20 | High | Low | Low | High | High | High | **KEEP** |
| **Electronics Gadgets**| 20 | Medium | High | High | Medium | High | Low | **KEEP** |
| **Smart Home Controls**| 20 | High | Low | Low | High | High | High | **KEEP / EXPAND** |
| **Emergency & Safety** | 20 | High | Low | Low | Medium | High | Medium | **SHRINK** |
| **Home Security** | 20 | High | Low | Low | Medium | High | High | **SHRINK** |
| **Photography Accs.** | 20 | Low | High | High | Low | Low | Low | **SHRINK** |
| **Hand Tools** | 20 | High | Low | Low | Medium | High | Low | **KEEP** |
| **Car Care & Polish** | 20 | Medium | High | Low | High | Medium | Medium | **SHRINK** |

---

## 2. Weak Keyword Families (Task 2)

We identified 8 systematically weak keyword families:

1. **Generic Stationeries & Desk Accessories** (e.g., `gel pens set black blue`, `paper clips`, `tape dispenser`): Highly commoditized, extremely cheap, zero reason to wait 2-3 weeks for AliExpress shipping.
2. **Replacement Components / Spare Parts** (e.g., `replacement blade`, `replacement filter`, `led board only`, `valve adapter`): Intended for repair rather than consumption. Causes low readiness and intent-matching problems.
3. **Office/Tripod Holders and Mounts** (e.g., `desk mount camera stand pole`, `camera mount holder`): Extremely niche, low general interest, boring visuals.
4. **Basic Phone Accessories** (e.g., `cell phone lanyard`, `phone charm strap`, `magnetic plate sticker`): Extremely cheap commodities with low purchase-potential, cluttering the feed.
5. **Generic Microfiber & Sanding Accessories** (e.g., `micro fiber cleaning cloths`, `sanding blocks sponge`, `applicator pads`): Commodities that have very low visual appeal and yield negligible commissions.
6. **Technical Hobbyist/Electronics Components** (e.g., `thermal paste syringe CPU`, `mini stereo amplifier board`): Target a developer/tech-DIY audience instead of mass-market consumer deals.
7. **Bicycle Repair/Connector Niche Tools** (e.g., `bike chain lube`, `spoke lights`, `valve adapter Presta Schrader`): Irrelevant to average Telegram users.
8. **Simple Decorative/Charm Objects** (e.g., `photo frame collage`, `hanging planter basket`): Low utility, hard to sell through a text-and-image affiliate feed without custom decor styling.

---

## 3. Classification Counts (Task 1)

To transition from Discovery V2 to V2.1:

* **KEEP**: **342 keywords** (57%) — High-converting, problem-solving, and visual.
* **IMPROVE/REWRITE**: **110 keywords** (18%) — Formatted into long-tail specific complete-product queries.
* **REPLACE**: **120 keywords** (20%) — Weak commodities replaced by high-converting visual gadgets.
* **REMOVE**: **50 keywords** (9%) — Completely pruned to streamline the database and category weights.
* **ADD**: **28 keywords** — New high-potential products.

---

## 4. Proposed Category Weighting (Task 5)

Category scheduling weights (`weight` in `discoveryLibraryV2`) are preserved exactly to maintain scheduler stability, while keyword counts inside each category are dynamically set based on product opportunities:

| Category ID | Current Keyword Count | Proposed Keyword Count | Current Weight | Proposed Weight |
|---|---|---|---|---|
| `kitchen` | 20 | 25 | 10 | 10 |
| `car` | 20 | 25 | 10 | 10 |
| `home` | 20 | 22 | 9 | 9 |
| `cleaning` | 20 | 20 | 8 | 8 |
| `organization` | 20 | 22 | 8 | 8 |
| `diy` | 20 | 15 | 7 | 7 |
| `travel` | 20 | 20 | 8 | 8 |
| `camping` | 20 | 18 | 8 | 8 |
| `pets` | 20 | 18 | 6 | 6 |
| `phone` | 20 | 12 | 7 | 7 |
| `computer` | 20 | 12 | 6 | 6 |
| `office` | 20 | 12 | 6 | 6 |
| `lighting` | 20 | 25 | 9 | 9 |
| `garden` | 20 | 14 | 8 | 8 |
| `bathroom` | 20 | 20 | 7 | 7 |
| `laundry` | 20 | 14 | 7 | 7 |
| `coffee` | 20 | 12 | 6 | 6 |
| `baby` | 20 | 14 | 5 | 5 |
| `kids` | 20 | 14 | 5 | 5 |
| `fitness` | 20 | 12 | 5 | 5 |
| `bicycle` | 20 | 12 | 5 | 5 |
| `bbq` | 20 | 12 | 6 | 6 |
| `storage` | 20 | 20 | 8 | 8 |
| `electronics` | 20 | 18 | 7 | 7 |
| `smarthome` | 20 | 25 | 7 | 7 |
| `emergency` | 20 | 15 | 6 | 6 |
| `security` | 20 | 15 | 6 | 6 |
| `photography` | 20 | 10 | 4 | 4 |
| `tools` | 20 | 20 | 7 | 7 |
| `car_care` | 20 | 14 | 8 | 8 |

**Total Proposed Keywords**: **507** (down from 600).
**Total Proposed Categories**: **30** (retains all original categories).

---

## 5. Proposed Replacement & New Long-Tail Keywords (Task 3)

We propose long-tail keywords describing **complete consumer products** with visual wow-factors:

* **Kitchen**: `mini heat bag sealer rechargeable`, `oil spray dispenser for cooking`, `garlic press rocker stainless steel`, `automatic pan stirrer timer`, `electric wine opener set rechargeable`.
* **Home Organization**: `under sink sliding organizer pull out`, `silicone cable clip organizer self adhesive`, `magnetic remote control holder wall`.
* **Smart Lighting**: `motion sensor under cabinet light magnetic`, `toilet bowl night light motion sensor`, `candle warmer lamp dimmable wood`.
* **Cleaning**: `desktop vacuum cleaner mini usb`, `pet hair remover roller reusable`, `groove window cleaning brush tool`.
* **Car Convenience**: `wireless car vacuum cleaner handheld`, `solar rotating car air freshener`, `car seat headrest hook hanger`.

---

## 6. Product Mix & Wow/Utility Balance (Task 4)

Our proposed keywords map to the target strategic product mix:

* **A. WOW / Problem Solver (~60%)**: e.g., `mini heat bag sealer rechargeable`, `flame aroma diffuser humidifier`.
* **B. Proven Utility (~25%)**: e.g., `magnetic wristband for screws`, `digital tire pressure gauge`.
* **C. Commercial Opportunity (~10%)**: e.g., `fast charging magnetic usb cable`, `mini portable photo printer`.
* **D. Premium / Gold Deal (~5%)**: e.g., `portable pocket projector smart`, `cordless rotary tool kit rechargeable`.

**Assessment**: The mix is healthy because it grounds the channel in daily utility (preventing it from becoming a catalog of cheap gimmicks) while keeping conversion rates high via problem-solvers.

---

## 7. Commercial Discovery Readiness Assessment (Task 6)

Our crawler and normalizer process the following AliExpress fields:
- `lastest_volume` (mapped to `salesCount`)
- `evaluate_rate` (mapped to `rating`)
- `commission_rate` (available in provider payload, mapped to `commissionRate`)
- `discount` (mapped to `discountPercent`)

**Architectural Assessment**: Our future architecture can support the 80/10/10 split:
* **80% Keyword/Category Discovery**: Runs V2.1 category rotation scheduler.
* **10% Hot/Trending Discovery**: We can introduce a crawler strategy querying AliExpress's top sales endpoint or sorting search results by sales descending without keyword constraints.
* **10% High-Commission Discovery**: Querying the high-commission promotion lists from AliExpress API directly.

---

## 8. Telegram CTA Technical Audit (Task 7)

We analyzed replacing the raw affiliate URL link with `<a href="AFF_LINK">לרכישה באליאקספרס 🛒</a>`:

1. **Required Validations**:
   - `validateAffiliateUrlInPost` in `src/features/publishing/telegram-provider.ts` validates that the raw affiliate link is present exactly once, and that it is the exact text of the last line of the post.
   - If we change to an HTML link, this validation will fail unless we rewrite it to parse the HTML anchor tag `href` attribute.
2. **Code Modifications**:
   - `src/features/publishing/telegram-provider.ts` -> update `validateAffiliateUrlInPost`.
   - `src/features/publishing/formatter.ts` -> update `buildTelegramHtmlPost` to output `<a href="...">` instead of the raw link on a new line.
3. **HTML Captions with sendPhoto**:
   - Yes, Telegram supports HTML tags inside caption fields for photos.
4. **Fallback Plain-Text Handling**:
   - If fallback triggers, `stripTelegramHtml(html)` is called.
   - Currently, it only strips `<b>` and `<s>` tags.
   - If we introduce `<a>` tags, `stripTelegramHtml` **must be updated** to parse the `href` attribute and append the raw URL, otherwise the plain-text message will lose the affiliate link entirely!
5. **Reliability Risk**:
   - **MEDIUM-HIGH**. If the HTML link is malformed or rejected by Telegram, the fallback plain-text *must* extract and append the link. Any bug in the regex parser will result in unsent links or immediate channel posting bans.
   - **Verdict (final, updated 12/8)**: Do NOT implement this change. This is not a "not yet" — the owner has explicitly decided to keep the raw affiliate link visible in the post body **in addition to** the inline purchase button, as a permanent design choice, not only for delivery-safety reasons. No further work is planned on hiding/wrapping the raw link.

---

## 9. Proposed Discovery V2.1 Library Diff (Task 10)

Here is the exact diff for the proposed Discovery Library V2.1:

### REMOVED:
* `thermal paste syringe CPU` -> **REMOVED** from `computer` (Hobbyist component, low consumer appeal).
* `keycap puller key extraction tool` -> **REMOVED** from `computer` (Niche utility, cheap commodity).
* `push pin clips wood pegs` -> **REMOVED** from `office` (Commodity desk supply, no wait reason).
* `spoke lights wheel lights LED` -> **REMOVED** from `bicycle` (Niche accessory, low average interest).
* `valve adapter converter presta schrader` -> **REMOVED** from `bicycle` (Replacement component, causes low readiness).
* `led tester detector backlight tester` -> **REMOVED** from `electronics` (Specialist electronics tool, low general consumer appeal).

### REPLACED:
* `bag sealer` -> `mini heat bag sealer rechargeable` (Kitchen) -> Adds specificity for rechargeable consumer products.
* `car phone holder` -> `car phone holder magnetic dashboard` (Car) -> Focuses query on complete magnetic mounts.
* `super glue adhesive gel` -> `rechargeable hot glue gun cordless` (DIY) -> Upgrades cheap commodity to a premium tool.
* `micro fiber cleaning cloths` -> `reusable pet hair remover roller` (Cleaning) -> Upgrades generic cloth to a high-converting problem solver.
* `gel pens set black blue` -> `erasable retractable gel pen set` (Office) -> Upgrades generic commodity to a fun specialty stationery.

### ADDED:
* `mini portable pocket projector smart` -> **ADDED** to `smarthome` (Gold Deal premium opportunity).
* `candle warmer lamp dimmable wood` -> **ADDED** to `lighting` (Problem solver / home decor hybrid).
* `automatic pan stirrer timer` -> **ADDED** to `kitchen` (Wow factor / novelty kitchen gadget).
* `electric wine opener set rechargeable` -> **ADDED** to `kitchen` (High commercial value gift item).
* `magnetic remote control holder wall` -> **ADDED** to `organization` (Problem solver / home storage).
