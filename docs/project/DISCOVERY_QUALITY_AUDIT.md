# Product Discovery Quality Audit (V2.1)

## 1. Executive Summary

This audit evaluates the quality and conversion potential of the **600 keywords** across the **30 categories** defined in [discovery-config.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/discovery/discovery-config.ts) for the **Affiliate Content Engine V2** library.

While the V2 scheduler does an excellent job of managing category diversity and rotation, the commercial success of a Telegram deals channel depends heavily on the **impulse-purchase potential** and **practical usefulness** of the products discovered. This audit identifies systematic failure patterns, evaluates category business values, and proposes an optimization plan to pivot the channel toward high-conversion product discoveries.

### Key Findings:
- **Average Discovery Quality Score**: **6.45 / 10** across the active library. This indicates solid baseline quality, but leaves significant room for optimization in niche or commodity categories.
- **Keyword Verdict Counts**:
  - **KEEP**: **528** (88%) - Strong search intents that return high-utility consumer products.
  - **IMPROVE**: **9** (1.5%) - Good product concepts but require more specific, longer-tail search queries to avoid low-quality AliExpress matches.
  - **REPLACE**: **34** (5.6%) - Categories that are useful, but the specific keyword represents a generic commodity easily bought locally for pennies (e.g., standard glue, tape, rags).
  - **REMOVE**: **29** (4.8%) - Keywords returning irrelevant replacement parts, accessories for accessories, or products with a high disappointment/low-quality rate on AliExpress (e.g., car scratch repair pens, thermal paste syringes).
- **Symmetry Bottleneck**: The current "exactly 20 keywords per category" restriction artificially forces weaker searches in niche categories (like *Photography*, *Bicycle*, and *Fitness*) while limiting search coverage in high-potential categories (like *Kitchen*, *Car*, *Lighting*, and *Organization*).

## 2. Scoring Methodology

To evaluate each search query objectively, we use a weighted scoring model tailored for a Telegram affiliate channel. The formula scores keywords on a scale of **1 to 10**:

$$\text{Discovery Quality Score} = (A \times 0.25) + (B \times 0.15) + (C \times 0.20) + (D \times 0.15) + (E \times 0.15) + (F \times 0.10) - (G \times 0.05) - (H \times 0.05)$$

### Score Parameters:
- **Product Intent Quality (A - 25% Weight)**: Does this keyword search specifically for a standalone, ready-to-use product, or does it return bulk materials/niche accessories?
- **Practical Usefulness (B - 15% Weight)**: Does the product solve a real, everyday problem for the consumer?
- **Impulse Purchase Potential (C - 20% Weight)**: Is the product cheap enough (typically under 75 ILS) and appealing enough to trigger a rapid buying decision without long research?
- **Visual / Telegram Appeal (D - 15% Weight)**: Can the value of the product be immediately understood from a single image/caption?
- **Broad Audience Relevance (E - 15% Weight)**: Is this product relevant to a general consumer, or is it limited to a tiny niche of professionals or hobbyists?
- **Search Precision (F - 10% Weight)**: How specific is the search query? Will it return the exact target product, or a mix of random parts and irrelevant items?
- **Commodity Saturation Risk (G - negative 5% Weight)**: Is this item so common and cheap locally (e.g. glue, AA batteries) that ordering it online makes no sense?
- **Bad Search Result Risk (H - negative 5% Weight)**: How likely is the AliExpress search engine to return broken, low-quality, or completely irrelevant items for this query?

## 3. Category-by-Category Audit

Below is the business value and quality analysis for each of the 30 categories. Category weights represent **Business Value/Purchase Potential** (not diversity weight, which the scheduler handles independently).

### Kitchen Gadgets (🍳)
- **Current Weight**: 10 | **Recommended Weight**: 10
- **Average Category Score**: **7.30 / 10**
- **Category Verdict**: `KEEP / INCREASE WEIGHT`
- **Best 3 Keywords**: `bag sealer mini` (9.4), `vegetable chopper` (7.4), `oil spray bottle` (7.4)
- **Worst 3 Keywords**: `jar opener under cabinet` (6.4), `herb scissors 5 blade` (6.4), `knife sharpener tool` (6.4)
- **Main Strengths**: Highly visual problem solvers, broad audience appeal, high impulse buy potential.
- **Main Weaknesses**: A few commodity keywords (e.g., spatula set, pens) need replacing.

### Car Accessories (🚗)
- **Current Weight**: 10 | **Recommended Weight**: 10
- **Average Category Score**: **7.17 / 10**
- **Category Verdict**: `KEEP / INCREASE WEIGHT`
- **Best 3 Keywords**: `car vacuum cleaner wireless` (9.3), `portable tire inflator` (7.3), `car phone holder magnetic` (7.3)
- **Worst 3 Keywords**: `scratch repair pen car` (4.9), `jump starter power bank` (5.9), `car door edge protector` (7.3)
- **Main Strengths**: Highly visual problem solvers, broad audience appeal, high impulse buy potential.
- **Main Weaknesses**: A few commodity keywords (e.g., spatula set, pens) need replacing.

### Home Decor & Utility (🏡)
- **Current Weight**: 9 | **Recommended Weight**: 9
- **Average Category Score**: **6.63 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `key bowl for entry table` (9.1), `door draft stopper` (6.6), `digital hygrometer thermometer` (6.6)
- **Worst 3 Keywords**: `carpet tape double sided` (5.8), `photo frame collage wall` (6.0), `essential oil diffuser ultrasonic` (6.0)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Cleaning Tools (🧹)
- **Current Weight**: 8 | **Recommended Weight**: 8
- **Average Category Score**: **6.93 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `telescopic cleaning brush` (7.0), `window squeegee cleaner` (7.0), `microfiber duster extendable` (7.0)
- **Worst 3 Keywords**: `micro fiber cleaning cloths` (6.2), `sponge holder kitchen sink` (6.2), `screen cleaner spray cloth` (6.2)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Home Organization (📦)
- **Current Weight**: 8 | **Recommended Weight**: 9
- **Average Category Score**: **7.60 / 10**
- **Category Verdict**: `KEEP / INCREASE WEIGHT`
- **Best 3 Keywords**: `under sink organizer sliding` (9.4), `cable clip organizer silicone` (9.4), `refrigerator magnet spice rack` (9.4)
- **Worst 3 Keywords**: `desk organizer pen holder` (6.2), `foil and plastic wrap organizer` (7.0), `bedside caddy organizer bag` (7.0)
- **Main Strengths**: Highly visual problem solvers, broad audience appeal, high impulse buy potential.
- **Main Weaknesses**: A few commodity keywords (e.g., spatula set, pens) need replacing.

### DIY & Crafting (🛠️)
- **Current Weight**: 7 | **Recommended Weight**: 7
- **Average Category Score**: **6.65 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `contour gauge duplicator` (9.0), `magnetic wristband for screws` (9.0), `laser level line tool` (6.8)
- **Worst 3 Keywords**: `screw extractor set damaged` (5.1), `sanding blocks sponge` (5.9), `super glue adhesive gel` (5.9)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Travel Accessories (✈️)
- **Current Weight**: 8 | **Recommended Weight**: 8
- **Average Category Score**: **6.60 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `packing cubes travel compression` (6.6), `travel bottle set silicone` (6.6), `luggage scale digital portable` (6.6)
- **Worst 3 Keywords**: `foldable duffle bag travel` (6.6), `sleeping eye mask contoured` (6.6), `tech organizer travel case` (6.6)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Camping Gear (🏕️)
- **Current Weight**: 8 | **Recommended Weight**: 8
- **Average Category Score**: **6.57 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `camping lantern rechargeable` (6.6), `fire starter flint steel` (6.6), `paracord bracelet survival tool` (6.6)
- **Worst 3 Keywords**: `camping folding bucket` (6.0), `waterproof dry bag backpack` (6.6), `tent stakes heavy duty peg` (6.6)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Pet Accessories (🐶)
- **Current Weight**: 6 | **Recommended Weight**: 6
- **Average Category Score**: **6.61 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `dog water bottle portable` (8.8), `pet grooming glove brush` (6.6), `cat self groomer wall brush` (6.6)
- **Worst 3 Keywords**: `dog grooming scissors kit` (5.3), `dog seat belt harness car` (6.1), `pet hair dryer stand` (6.6)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Phone Gadgets (📱)
- **Current Weight**: 7 | **Recommended Weight**: 7
- **Average Category Score**: **6.60 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `magnetic phone stand desk` (6.6), `ring light with stand desktop` (6.6), `phone charm strap beaded` (6.6)
- **Worst 3 Keywords**: `phone charging cable fast magnetic` (6.6), `cell phone stand table holder` (6.6), `wireless selfie stick tripod` (6.6)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Computer Accessories (💻)
- **Current Weight**: 6 | **Recommended Weight**: 6
- **Average Category Score**: **6.36 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `keyboard cleaning brush kit` (6.6), `monitor light bar screenbar` (6.6), `laptop stand aluminum adjustable` (6.6)
- **Worst 3 Keywords**: `thermal paste syringe CPU` (3.5), `keycap puller key extraction tool` (4.8), `wireless presenter pointer remote` (6.6)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Office Supplies (💼)
- **Current Weight**: 6 | **Recommended Weight**: 4
- **Average Category Score**: **6.03 / 10**
- **Category Verdict**: `REDUCE WEIGHT / REPLACE`
- **Best 3 Keywords**: `desk organizer document holder` (6.6), `paper cutter paper trimmer` (6.6), `cable sleeve zipper management` (6.6)
- **Worst 3 Keywords**: `gel pens set black blue` (5.1), `tape dispenser desk holder` (5.1), `file folder expanding letter` (5.1)
- **Main Strengths**: Contains occasional utility gems.
- **Main Weaknesses**: Too many narrow-audience keywords, replacement parts (e.g. valve adapters), or local commodities (e.g. stapler removers).

### Utility Lighting (💡)
- **Current Weight**: 9 | **Recommended Weight**: 10
- **Average Category Score**: **6.85 / 10**
- **Category Verdict**: `KEEP / INCREASE WEIGHT`
- **Best 3 Keywords**: `motion sensor light strip closet` (9.1), `toilet bowl night light motion` (9.1), `under cabinet light rechargeable` (6.6)
- **Worst 3 Keywords**: `step light indoor motion wall` (6.6), `mini flashlight keychain USB rechargeable` (6.6), `flexible strip light neon sign` (6.6)
- **Main Strengths**: Highly visual problem solvers, broad audience appeal, high impulse buy potential.
- **Main Weaknesses**: A few commodity keywords (e.g., spatula set, pens) need replacing.

### Garden Tools (🪴)
- **Current Weight**: 8 | **Recommended Weight**: 8
- **Average Category Score**: **6.49 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `solar motion light outdoor garden` (6.6), `plant watering spikes self water` (6.6), `drip irrigation kit system garden` (6.6)
- **Worst 3 Keywords**: `bug zapper solar lamp garden` (5.3), `garden grafting tool scissors kit` (5.8), `plant ties velcro soft roll` (6.6)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Bathroom Utility (🛁)
- **Current Weight**: 7 | **Recommended Weight**: 7
- **Average Category Score**: **6.68 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `toothpaste squeegee roller wall mount` (9.1), `silicone sink faucet splash guard` (6.6), `toilet brush silicone holder soft` (6.6)
- **Worst 3 Keywords**: `soap dispenser wall mount manual` (5.8), `waterproof phone box bathroom wall` (6.6), `toilet bowl deodorizer gel stamp` (6.6)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Laundry Helpers (🧺)
- **Current Weight**: 7 | **Recommended Weight**: 7
- **Average Category Score**: **6.48 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `washing machine feet pad anti` (9.1), `mesh laundry bags underwear bra` (6.6), `wool dryer balls natural softener` (6.6)
- **Worst 3 Keywords**: `clothespins pegs wooden plastic clamp` (5.8), `clothes line portable travel clothes` (5.8), `clothes drying rack sock hanger` (5.8)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Coffee Gadgets (☕)
- **Current Weight**: 6 | **Recommended Weight**: 6
- **Average Category Score**: **6.56 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `coffee frother electric mixer` (6.6), `coffee grinder manual hand crank` (6.6), `pour over coffee dripper cup` (6.6)
- **Worst 3 Keywords**: `coffee syrup dispenser bottle pump` (5.8), `espresso cleaning brush grinder cleaning` (6.6), `cold brew coffee maker bottle` (6.6)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Baby Safety & Care (👶)
- **Current Weight**: 5 | **Recommended Weight**: 3
- **Average Category Score**: **5.72 / 10**
- **Category Verdict**: `REDUCE WEIGHT / REPLACE`
- **Best 3 Keywords**: `baby corner protector table guard` (5.7), `cabinet locks child safety strap` (5.7), `silicone baby bib pocket bib` (5.7)
- **Worst 3 Keywords**: `baby safety harness walking helper` (5.2), `baby head protection pad backpack` (5.7), `baby nail trimmer electric file` (5.7)
- **Main Strengths**: Contains occasional utility gems.
- **Main Weaknesses**: Too many narrow-audience keywords, replacement parts (e.g. valve adapters), or local commodities (e.g. stapler removers).

### Kids Toys & Activity (🧸)
- **Current Weight**: 5 | **Recommended Weight**: 5
- **Average Category Score**: **6.45 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `magnetic drawing board sketch pad` (6.4), `LCD writing tablet digital board` (6.4), `wooden pattern blocks puzzle` (6.4)
- **Worst 3 Keywords**: `paper airplane launcher folding toy` (6.4), `kids watch analog teaching learning` (6.4), `child height ruler wall hanging` (6.4)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Fitness Accessories (🏋️)
- **Current Weight**: 5 | **Recommended Weight**: 3
- **Average Category Score**: **5.77 / 10**
- **Category Verdict**: `REDUCE WEIGHT / REPLACE`
- **Best 3 Keywords**: `resistance bands elastic loop exercise` (5.8), `ab roller wheel abdominal core` (5.8), `jump rope digital counter speed` (5.8)
- **Worst 3 Keywords**: `kinesiology tape sports tape muscle` (5.2), `exercise ball hand pump balance` (5.8), `pilates ring dual grip circle` (5.8)
- **Main Strengths**: Contains occasional utility gems.
- **Main Weaknesses**: Too many narrow-audience keywords, replacement parts (e.g. valve adapters), or local commodities (e.g. stapler removers).

### Bicycle Gear (🚲)
- **Current Weight**: 5 | **Recommended Weight**: 3
- **Average Category Score**: **5.46 / 10**
- **Category Verdict**: `REDUCE WEIGHT / REPLACE`
- **Best 3 Keywords**: `bicycle phone mount handlebar holder` (5.6), `bike light USB rechargeable head` (5.6), `bike saddle cushion gel seat` (5.6)
- **Worst 3 Keywords**: `valve adapter converter presta schrader` (4.7), `bike chain lube clean dry` (4.7), `spoke lights wheel lights LED` (4.7)
- **Main Strengths**: Contains occasional utility gems.
- **Main Weaknesses**: Too many narrow-audience keywords, replacement parts (e.g. valve adapters), or local commodities (e.g. stapler removers).

### BBQ Utilities (🍖)
- **Current Weight**: 6 | **Recommended Weight**: 6
- **Average Category Score**: **6.10 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `meat claws shredder pulled pork` (6.1), `grill brush scraper stainless wire` (6.1), `bbq meat thermometer instant read` (6.1)
- **Worst 3 Keywords**: `bbq cleaning brick block stone` (6.1), `skewers rack barbecue frame stand` (6.1), `bbq apron canvas utility apron` (6.1)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Home Storage (🗃️)
- **Current Weight**: 8 | **Recommended Weight**: 9
- **Average Category Score**: **6.98 / 10**
- **Category Verdict**: `KEEP / INCREASE WEIGHT`
- **Best 3 Keywords**: `vacuum storage bags space saving` (7.0), `shoe storage box clear stackable` (7.0), `cosmetic display stand storage drawer` (7.0)
- **Worst 3 Keywords**: `pen organizer holder storage desk` (6.2), `storage organizer bins drawer organizer` (6.5), `blanket storage bag zipper bag` (7.0)
- **Main Strengths**: Highly visual problem solvers, broad audience appeal, high impulse buy potential.
- **Main Weaknesses**: A few commodity keywords (e.g., spatula set, pens) need replacing.

### Electronics Gadgets (🔌)
- **Current Weight**: 7 | **Recommended Weight**: 7
- **Average Category Score**: **5.81 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `magnetic cable organizer clip desktop` (6.2), `magnifying glass hand loupe lens` (6.2), `USB adapter converter type c` (6.2)
- **Worst 3 Keywords**: `led tester detector backlight tester` (4.7), `digital microscope screen camera zoom` (4.9), `portable laser distance meter rangefinder` (4.9)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Smart Home Controls (🎛️)
- **Current Weight**: 7 | **Recommended Weight**: 7
- **Average Category Score**: **6.00 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `smart plug socket wifi plug` (6.2), `smart switch button pusher remote` (6.2), `IR remote control smart hub` (6.2)
- **Worst 3 Keywords**: `smart gas leak alarm gas` (4.9), `smart water leak detector alarm` (4.9), `wifi garage door opener remote` (5.5)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Emergency & Safety (🚨)
- **Current Weight**: 6 | **Recommended Weight**: 6
- **Average Category Score**: **6.50 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `hand crank radio solar emergency` (6.6), `emergency whistle rescue loud whistle` (6.6), `space blanket emergency thermal foil` (6.6)
- **Worst 3 Keywords**: `tactical pen glass breaker weapon` (5.8), `first aid kit bag empty` (6.0), `emergency survival kit bag gear` (6.0)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Home Security (🔒)
- **Current Weight**: 6 | **Recommended Weight**: 6
- **Average Category Score**: **6.72 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `portable door lock travel lock` (9.1), `key lock box wall mount` (6.6), `door stop alarm sensor alert` (6.6)
- **Worst 3 Keywords**: `security door stop bar bracket` (6.6), `book safe combination dictionary safe` (6.6), `hidden wall socket safe box` (6.6)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Photography Accessories (📷)
- **Current Weight**: 4 | **Recommended Weight**: 3
- **Average Category Score**: **4.88 / 10**
- **Category Verdict**: `REDUCE WEIGHT / REPLACE`
- **Best 3 Keywords**: `mini light box photo studio` (5.0), `photo background paper studio backdrop` (5.0), `universal diffuser softbox flash reflector` (5.0)
- **Worst 3 Keywords**: `lens hood cover sun shade` (4.4), `hot shoe bubble level spirit` (4.4), `bounce card flash diffuser card` (4.4)
- **Main Strengths**: Contains occasional utility gems.
- **Main Weaknesses**: Too many narrow-audience keywords, replacement parts (e.g. valve adapters), or local commodities (e.g. stapler removers).

### Hand Tools (🔧)
- **Current Weight**: 7 | **Recommended Weight**: 7
- **Average Category Score**: **6.67 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `magnetic screwdriver set precision kits` (6.8), `universal socket wrench multi tool` (6.8), `digital pocket scale gram scale` (6.8)
- **Worst 3 Keywords**: `thread pitch gauge metric screw` (5.1), `hex key wrench set allen` (6.8), `level tool pocket level bubble` (6.8)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

### Car Care & Polish (🧽)
- **Current Weight**: 8 | **Recommended Weight**: 8
- **Average Category Score**: **6.43 / 10**
- **Category Verdict**: `KEEP`
- **Best 3 Keywords**: `microfiber car drying towel towel` (6.6), `car washing mitt chenille glove` (6.6), `clay bar car detailing clean` (6.6)
- **Worst 3 Keywords**: `scratch repair cloth wax compound` (4.5), `windshield glass water repellent spray` (5.3), `wash bucket dirt trap filter` (6.6)
- **Main Strengths**: Good balance of utility and audience relevance.
- **Main Weaknesses**: Requires refinement of generic search queries.

## 4. Failure Patterns in V2 Config

During our audit of the 600 keywords, we identified several systematic failure patterns that degrade discovery quality:

1. **The Commodity Trap**: Keywords like `felt furniture pads`, `super glue adhesive gel`, and `gel pens set black blue` return items that can be purchased for 2-5 ILS at any local dollar store. Users will not wait 2 weeks for AliExpress shipping for these.
2. **Accessories for Accessories / Replacement Parts**: Keywords like `valve adapter converter presta schrader` (bicycle), `step up ring filter step adapter` (photography), and `dust plugs laptop computer` (computer) are only useful if a user already owns a highly specific model and has lost a tiny sub-part. These are completely inappropriate for an impulse-buy feed.
3. **Dis disappointment & High Refund Risk**: Products like `scratch repair pen car` (which does not actually fix scratches and has terrible reviews), `digital voice recorder` (cheap electronics with terrible microphones), and `jump starter power bank` (often fake capacity and dangerous) lead to poor customer satisfaction and damage channel trust.
4. **Overly Generic Search Intents**: Keywords like `first aid kit bag empty` or `emergency survival kit bag gear` often return generic empty nylon pouches rather than the actual useful gear because the query is too open-ended.
5. **Wired / Professional Installation Friction**: Keywords like `smart light switch wall panel` require electrical wiring knowledge. This is a huge friction point for general users compared to a plug-and-play smart plug.

## 5. High-Conversion Product Archetypes

We have identified the following key product archetypes that align perfectly with Telegram channel sales:

1. **The Space Saver**: Solves closet/kitchen/bathroom storage problems. Extremely visual (clear before/after). Low price.
     - *Existing Examples*: `vacuum storage bags space saving`, `under sink organizer sliding`
     - *New Directions*: `stackable shoe slots organizer`, `magnetic spice jars wall`
2. **The "Quiet Utility" Problem Solver**: Small tools that resolve a minor daily annoyance.
     - *Existing Examples*: `door draft stopper`, `toothpaste squeegee roller wall mount`
     - *New Directions*: `silicone cable organizer sleeve`, `anti-vibration washing machine pads`
3. **The Car Convenience Upgrade**: Low-cost modifications that make driving or riding more comfortable.
     - *Existing Examples*: `car vacuum cleaner wireless`, `seat gap filler organizer`
     - *New Directions*: `headrest hooks for grocery bags`, `magnetic phone mount car vent`
4. **Rechargeable/Motion Activated Lighting**: Visual, satisfying, modern, and cheap to run.
     - *Existing Examples*: `motion sensor light strip closet`, `toilet bowl night light motion`
     - *New Directions*: `magnetic wireless led bar`, `solar deck fence lights`

## 6. Price-Fit Analysis

To maximize click-through and impulse purchases, products should fall within specific price tiers:

| Price Tier | Range (ILS) | Consumer Friction | Target Categories |
|---|---|---|---|
| **Very Low Friction** | < 30 ILS | Extremely Low (Instant buy) | Cable clips, night lights, toothpaste rollers, silicone guards |
| **Low Friction** | 30 - 75 ILS | Low (Decent value) | Wireless vacuums, tire inflators, organizers, organizers |
| **Considered Impulse** | 75 - 150 ILS | Moderate (Needs justification) | Smart locks, dash cams, mechanical keyboard, premium diffusers |
| **Too Expensive** | > 150 ILS | High (Will research elsewhere) | Major appliances, diagnostic obd scanners (high-end) |

> [!TIP]
> We should prioritize keywords that naturally return products in the **Very Low** and **Low Friction** ranges (under 75 ILS / $20 USD) to match the channel's impulse-buy model.

## 7. Search Query Quality & Long-Tail Queries

AliExpress's search algorithm is highly literal. Generic search queries return a lot of noise. We recommend moving from generic terms to **feature-oriented, long-tail queries**:

- **Bad (Generic)**: `car phone holder` -> Returns thousands of identical plastic clips, some of low quality.
- **Good (Long-Tail)**: `magnetic car vent phone mount gravity` -> Returns specific, higher-utility products with higher perceived value.
- **Bad (Generic)**: `essential oil diffuser` -> Returns expensive humidifiers or cheap USB sticks.
- **Good (Feature-Oriented)**: `ultrasonic flame air humidifier diffuser` -> Returns a highly visual "flame effect" product with massive Telegram click appeal.

## 8. Missed Opportunities / New Search Directions

We identified several product areas that are currently underrepresented but carry high conversion potential:

1. **Smart Desk & Cable Management**: Cable sleeves, magnetic desktop cable holders, under-desk power strip mounts.
2. **Eco/Rechargeable Utility**: USB rechargeable lighters (electric arc), rechargeable hand warmers, solar power outdoor utility.
3. **Compact Travel Convenience**: Travel packing compression bags, portable travel laundry clothesline, travel luggage cup holders.
4. **Kitchen Organization Specifics**: Under-cabinet jar openers, wall-mounted bag dispensers, cereal dispensers.

## 9. Proposed V2.1 Strategy

We propose the following optimization actions to transition the library to **V2.1**:

1. **Keep 528 Keywords**: Keep the high-performing, high-utility keywords.
2. **Improve 9 Keywords**: Refine generic keywords into long-tail queries.
3. **Replace 34 Commodity Keywords**: Swap standard commodities (e.g. rags, glue) with visual problem solvers.
4. **Remove 29 Keywords**: Permanently drop niche parts, CPU grease, and highly disappointed products.
5. **Eliminate Symmetric Cap**: Move away from a rigid "20 keywords per category" limit. Allow high-potential categories (e.g., kitchen, car) to have up to 35 keywords, while reducing niche categories (e.g., photography) to 10 high-quality keywords.

## 10. Top & Bottom Keyword Rankings

### Top 20 Highest-Potential Keywords:
1. `bag sealer mini` (Kitchen Gadgets) - Score: **9.40** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
2. `under sink organizer sliding` (Home Organization) - Score: **9.40** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
3. `cable clip organizer silicone` (Home Organization) - Score: **9.40** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
4. `refrigerator magnet spice rack` (Home Organization) - Score: **9.40** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
5. `lazy susan turntable organizer` (Home Organization) - Score: **9.40** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
6. `key holder wall mount decorative` (Home Organization) - Score: **9.40** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
7. `car vacuum cleaner wireless` (Car Accessories) - Score: **9.25** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
8. `key bowl for entry table` (Home Decor & Utility) - Score: **9.10** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
9. `motion sensor light strip closet` (Utility Lighting) - Score: **9.10** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
10. `toilet bowl night light motion` (Utility Lighting) - Score: **9.10** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
11. `toothpaste squeegee roller wall mount` (Bathroom Utility) - Score: **9.10** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
12. `washing machine feet pad anti` (Laundry Helpers) - Score: **9.10** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
13. `portable door lock travel lock` (Home Security) - Score: **9.10** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
14. `contour gauge duplicator` (DIY & Crafting) - Score: **8.95** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
15. `magnetic wristband for screws` (DIY & Crafting) - Score: **8.95** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
16. `dog water bottle portable` (Pet Accessories) - Score: **8.80** - *High conversion archetype: visual, solves a specific pain point, and cheap.*
17. `vegetable chopper` (Kitchen Gadgets) - Score: **7.40** - *Decent utility product with acceptable audience relevance.*
18. `oil spray bottle` (Kitchen Gadgets) - Score: **7.40** - *Decent utility product with acceptable audience relevance.*
19. `garlic press rocker` (Kitchen Gadgets) - Score: **7.40** - *Decent utility product with acceptable audience relevance.*
20. `magnetic kitchen timer` (Kitchen Gadgets) - Score: **7.40** - *Decent utility product with acceptable audience relevance.*

### Top 20 Weakest/Lowest-Potential Keywords:
1. `thermal paste syringe CPU` (Computer Accessories) - Score: **3.55** - *Niche replacement part/accessory; irrelevant to 98% of users.*
2. `lens hood cover sun shade` (Photography Accessories) - Score: **4.45** - *Niche replacement part/accessory; irrelevant to 98% of users.*
3. `hot shoe bubble level spirit` (Photography Accessories) - Score: **4.45** - *Niche replacement part/accessory; irrelevant to 98% of users.*
4. `bounce card flash diffuser card` (Photography Accessories) - Score: **4.45** - *Niche replacement part/accessory; irrelevant to 98% of users.*
5. `step up ring filter step adapter` (Photography Accessories) - Score: **4.45** - *Niche replacement part/accessory; irrelevant to 98% of users.*
6. `scratch repair cloth wax compound` (Car Care & Polish) - Score: **4.50** - *AliExpress results often low quality, gimmicky, or fail to meet expectations.*
7. `valve adapter converter presta schrader` (Bicycle Gear) - Score: **4.70** - *Niche replacement part/accessory; irrelevant to 98% of users.*
8. `bike chain lube clean dry` (Bicycle Gear) - Score: **4.70** - *Niche replacement part/accessory; irrelevant to 98% of users.*
9. `spoke lights wheel lights LED` (Bicycle Gear) - Score: **4.70** - *Niche replacement part/accessory; irrelevant to 98% of users.*
10. `led tester detector backlight tester` (Electronics Gadgets) - Score: **4.75** - *Niche replacement part/accessory; irrelevant to 98% of users.*
11. `keycap puller key extraction tool` (Computer Accessories) - Score: **4.85** - *Niche replacement part/accessory; irrelevant to 98% of users.*
12. `battery case holder aa aaa` (Photography Accessories) - Score: **4.90** - *Highly saturated commodity; easily bought locally for pennies.*
13. `lens cleaning kit pen air` (Photography Accessories) - Score: **4.90** - *Highly saturated commodity; easily bought locally for pennies.*
14. `smart gas leak alarm gas` (Smart Home Controls) - Score: **4.95** - *AliExpress results often low quality, gimmicky, or fail to meet expectations.*
15. `smart water leak detector alarm` (Smart Home Controls) - Score: **4.95** - *AliExpress results often low quality, gimmicky, or fail to meet expectations.*
16. `digital microscope screen camera zoom` (Electronics Gadgets) - Score: **4.95** - *AliExpress results often low quality, gimmicky, or fail to meet expectations.*
17. `portable laser distance meter rangefinder` (Electronics Gadgets) - Score: **4.95** - *AliExpress results often low quality, gimmicky, or fail to meet expectations.*
18. `digital voice recorder dictaphone record` (Electronics Gadgets) - Score: **4.95** - *AliExpress results often low quality, gimmicky, or fail to meet expectations.*
19. `scratch repair pen car` (Car Accessories) - Score: **4.95** - *AliExpress results often low quality, gimmicky, or fail to meet expectations.*
20. `softbox lighting kit mini studio` (Photography Accessories) - Score: **5.00** - *Decent utility product with acceptable audience relevance.*

### Top 30 Proposed NEW Product/Search Opportunities:
1. `electric arc usb lighter rechargeable`
2. `magnetic cable clip desktop organizer`
3. `under desk power strip holder slider`
4. `stackable shoe slots space saver`
5. `silicone faucet mat sink splash guard`
6. `anti vibration pads for washing machine`
7. `headrest hooks for car bags hanger`
8. `magnetic screen door mesh closing`
9. `motion activated toilet bowl night light`
10. `refrigerator magnetic spice rack organizer`
11. `foldable cup holder for luggage travel`
12. `portable door lock security travel`
13. `lazy susan turntable cabinet organizer`
14. `wall mounted plastic bag holder dispenser`
15. `under cabinet jar opener gripper`
16. `silicone cup cover stretch lids`
17. `flame mist humidifier aroma diffuser`
18. `magnetic stove top shelf organizer`
19. `adjustable drawer organizer dividers dividers`
20. `shower phone holder waterproof box wall`
21. `magnetic dry erase board refrigerator calendar`
22. `handheld fabric steamer travel portable`
23. `reusable silicone food storage bags ziplock`
24. `led closet light motion sensor rechargeable`
25. `expandable drawer drawer silverware tray`
26. `broom mop wall holder organizer sliding`
27. `anti fog spray for glasses mirrors`
28. `wool dryer balls natural organic fabric`
29. `lint remover fabric shaver lint fuzz`
30. `magnetic key holder cloud shape entry`

## 11. Recommended Next Implementation Phase

1. **Review and Approve V2.1 Library**: Align on the keyword changes and variable category distribution.
2. **Update discovery-config.ts**: Swap the 63 rejected/weak keywords with the 30 new high-potential long-tail keywords, reducing the total library size to a highly concentrated ~550 premium keywords.
3. **Run E2E Validation Tests**: Run the discovery simulation tests to ensure V2.1 keywords return high-precision AliExpress results.

# Keyword Audit Detail

This table lists the audit scores for all 600 keywords in the library. Use this to identify candidates for improvement, replacement, or removal.

| Category | Keyword | Intent (A) | Utility (B) | Impulse (C) | Visual (D) | Audience (E) | Precision (F) | Saturation (G) | Bad Result (H) | Score | Verdict | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Kitchen Gadgets | `vegetable chopper` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `oil spray bottle` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `garlic press rocker` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `silicone spatula set` | 7 | 8 | 4 | 7 | 9 | 8 | 8 | 3 | **6.40** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Kitchen Gadgets | `magnetic kitchen timer` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `digital food scale` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `knife sharpener tool` | 7 | 8 | 4 | 7 | 9 | 8 | 8 | 3 | **6.40** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Kitchen Gadgets | `meat thermometer digital` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `milk frother handheld` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `silicone baking mat` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `herb scissors 5 blade` | 7 | 8 | 4 | 7 | 9 | 8 | 8 | 3 | **6.40** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Kitchen Gadgets | `bag sealer mini` | 10 | 10 | 10 | 9 | 9 | 10 | 4 | 2 | **9.40** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Kitchen Gadgets | `dish drying mat` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `egg timer indicator` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `cherry pitter tool` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `citrus juicer hand` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `dough scraper bench` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `salad spinner bowl` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kitchen Gadgets | `jar opener under cabinet` | 7 | 8 | 4 | 7 | 9 | 8 | 8 | 3 | **6.40** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Kitchen Gadgets | `corn cob stripper` | 7 | 8 | 8 | 7 | 9 | 8 | 4 | 3 | **7.40** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `portable tire inflator` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `car vacuum cleaner wireless` | 10 | 10 | 10 | 9 | 8 | 10 | 4 | 2 | **9.25** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Car Accessories | `car phone holder magnetic` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `Bluetooth FM transmitter car` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `obd2 scanner diagnostic tool` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `car organizer between seats` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `car trash can bin` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `blind spot mirrors car` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `windshield sun shade umbrella` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `trunk organizer foldable` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `seat gap filler organizer` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `car seat hook hanger` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `headrest tablet holder` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `steering wheel lock heavy duty` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `car air freshener solar` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `license plate backup camera` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `scratch repair pen car` | 3 | 8 | 4 | 7 | 8 | 8 | 8 | 9 | **4.95** | `REMOVE` | AliExpress results often low quality, gimmicky, or fail to meet expectations. |
| Car Accessories | `dash cam front and rear` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Accessories | `jump starter power bank` | 3 | 8 | 8 | 7 | 8 | 8 | 4 | 9 | **5.95** | `REMOVE` | AliExpress results often low quality, gimmicky, or fail to meet expectations. |
| Car Accessories | `car door edge protector` | 7 | 8 | 8 | 7 | 8 | 8 | 4 | 3 | **7.25** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `door draft stopper` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `digital hygrometer thermometer` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `key bowl for entry table` | 10 | 10 | 10 | 9 | 7 | 10 | 4 | 2 | **9.10** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Home Decor & Utility | `felt furniture pads` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `wall mount mail organizer` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `door handle bumper protector` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `window insulation film` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `essential oil diffuser ultrasonic` | 7 | 7 | 7 | 6 | 7 | 4 | 4 | 6 | **6.05** | `IMPROVE` | Overly generic query; likely to return low-quality or irrelevant items. |
| Home Decor & Utility | `magnetic screen door mesh` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `decorative wall hooks` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `carpet tape double sided` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Home Decor & Utility | `outlet cover box safety` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `photo frame collage wall` | 7 | 7 | 7 | 6 | 7 | 4 | 4 | 6 | **6.05** | `IMPROVE` | Overly generic query; likely to return low-quality or irrelevant items. |
| Home Decor & Utility | `step stool folding` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `window blind duster` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `remote control holder wall` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `table corner protector baby` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `draft guard window` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `leather repair patch adhesive` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Decor & Utility | `door stop wedge rubber` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `telescopic cleaning brush` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `window squeegee cleaner` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `microfiber duster extendable` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `keyboard cleaning gel` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `pet hair remover roller` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `bottle cleaning brush set` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `pumice stone toilet bowl cleaner` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `drill brush attachment set` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `mini desktop vacuum cleaner` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `lint shaver fabric defuzzer` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `drain clog remover tool` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `screen cleaner spray cloth` | 7 | 8 | 4 | 6 | 9 | 8 | 8 | 3 | **6.25** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Cleaning Tools | `blind cleaner tool` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `groove cleaning brush window` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `sponge holder kitchen sink` | 7 | 8 | 4 | 6 | 9 | 8 | 8 | 3 | **6.25** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Cleaning Tools | `stove gap covers silicone` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `washing machine cleaner tablets` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `micro fiber cleaning cloths` | 7 | 8 | 4 | 6 | 9 | 8 | 8 | 3 | **6.25** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Cleaning Tools | `shoe cleaner cream` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Cleaning Tools | `pot pan scraper tool` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `under sink organizer sliding` | 10 | 10 | 10 | 9 | 9 | 10 | 4 | 2 | **9.40** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Home Organization | `cable clip organizer silicone` | 10 | 10 | 10 | 9 | 9 | 10 | 4 | 2 | **9.40** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Home Organization | `makeup brush holder organizer` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `drawer dividers adjustable` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `remote control organizer holder` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `refrigerator magnet spice rack` | 10 | 10 | 10 | 9 | 9 | 10 | 4 | 2 | **9.40** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Home Organization | `purse organizer insert` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `belt hanger rack closet` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `hat rack hanger hooks` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `jewelry organizer box travel` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `egg holder for refrigerator` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `mop and broom holder wall` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `lazy susan turntable organizer` | 10 | 10 | 10 | 9 | 9 | 10 | 4 | 2 | **9.40** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Home Organization | `water bottle organizer rack` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `socks underwear organizer divider` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `cord wrapper for kitchen appliances` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `bedside caddy organizer bag` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Organization | `key holder wall mount decorative` | 10 | 10 | 10 | 9 | 9 | 10 | 4 | 2 | **9.40** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Home Organization | `desk organizer pen holder` | 7 | 8 | 4 | 6 | 9 | 8 | 8 | 3 | **6.25** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Home Organization | `foil and plastic wrap organizer` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `contour gauge duplicator` | 10 | 10 | 10 | 9 | 6 | 10 | 4 | 2 | **8.95** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| DIY & Crafting | `magnetic wristband for screws` | 10 | 10 | 10 | 9 | 6 | 10 | 4 | 2 | **8.95** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| DIY & Crafting | `laser level line tool` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `hot glue gun cordless` | 7 | 9 | 4 | 6 | 6 | 8 | 8 | 3 | **5.95** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| DIY & Crafting | `thread locker glue blue` | 7 | 9 | 4 | 6 | 6 | 8 | 8 | 3 | **5.95** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| DIY & Crafting | `tape measure digital` | 7 | 9 | 4 | 6 | 6 | 8 | 8 | 3 | **5.95** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| DIY & Crafting | `wire stripper cutter auto` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `silicone sealant tool kit` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `screw extractor set damaged` | 7 | 9 | 2 | 6 | 2 | 8 | 4 | 3 | **5.15** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| DIY & Crafting | `hand drill pin vise` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `utility knife folding utility` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `drywall patch repair kit` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `precision tweezers set antistatic` | 7 | 9 | 4 | 6 | 6 | 8 | 8 | 3 | **5.95** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| DIY & Crafting | `plastic welder staple gun` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `caliper digital stainless steel` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `corner clamp 90 degree` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `super glue adhesive gel` | 7 | 9 | 4 | 6 | 6 | 8 | 8 | 3 | **5.95** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| DIY & Crafting | `sanding blocks sponge` | 7 | 9 | 4 | 6 | 6 | 8 | 8 | 3 | **5.95** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| DIY & Crafting | `glass cutter tool wheel` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| DIY & Crafting | `rotary tool kit mini` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `packing cubes travel compression` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `travel bottle set silicone` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `luggage scale digital portable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `neck pillow memory foam travel` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `passport holder wallet RFID` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `travel adapter universal plug` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `luggage tag leather privacy` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `shoe bags travel storage` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `portable pill organizer travel` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `quick dry microfiber towel` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `TSA approved luggage locks` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `compact umbrella windproof travel` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `travel laundry bag dirty` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `cup holder for luggage suitcase` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `security door lock portable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `toothbrush travel case capsule` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `belt bag travel fanny pack` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `tech organizer travel case` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `sleeping eye mask contoured` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Travel Accessories | `foldable duffle bag travel` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `camping lantern rechargeable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `fire starter flint steel` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `paracord bracelet survival tool` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `collapsible water bucket` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `camping folding bucket` | 7 | 7 | 7 | 6 | 7 | 4 | 4 | 6 | **6.05** | `IMPROVE` | Overly generic query; likely to return low-quality or irrelevant items. |
| Camping Gear | `emergency sleeping bag thermal` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `collapsible pocket bellows` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `portable camping shower water` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `camping cup stainless steel` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `sleeping pad camping inflatable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `hammock double tree straps` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `compass survival pocket` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `camping pillow inflatable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `camping micro pillow` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `solar charger power bank waterproof` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `mosquito head net mesh` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `camping stove wind screen` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `collapsible cooking pot silicone` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `tent stakes heavy duty peg` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Camping Gear | `waterproof dry bag backpack` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `dog water bottle portable` | 10 | 10 | 10 | 9 | 5 | 10 | 4 | 2 | **8.80** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Pet Accessories | `pet grooming glove brush` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `cat self groomer wall brush` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `dog nail grinder electric` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `cat laser toy automatic` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `slow feeder dog bowl` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `pet hair remover brush car` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `dog leash double two handle` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `cat window perch hammock` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `dog grooming scissors kit` | 7 | 8 | 4 | 7 | 5 | 4 | 8 | 6 | **5.25** | `IMPROVE` | Overly generic query; likely to return low-quality or irrelevant items. |
| Pet Accessories | `collapsible dog bowls travel` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `dog treat pouch training bag` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `pet feeding mat silicone` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `dog seat belt harness car` | 7 | 8 | 7 | 7 | 5 | 4 | 4 | 6 | **6.05** | `IMPROVE` | Overly generic query; likely to return low-quality or irrelevant items. |
| Pet Accessories | `cat scratching post sisal` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `pet collar light LED` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `cat litter scoop holder` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `tick remover tool set` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `dog toothbrush toy rubber` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Pet Accessories | `pet hair dryer stand` | 7 | 8 | 7 | 7 | 5 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `magnetic phone stand desk` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `ring light with stand desktop` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `phone charm strap beaded` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `cell phone lanyard wrist strap` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `privacy screen protector glass` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `phone cleaner kit port` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `universal phone mount tripod` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `wireless charging station dock` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `phone screen magnifier projector` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `phone wallet sleeve stick on` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `waterproof phone pouch bag` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `phone cooler fan radiator` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `magnetic plate sticker phone` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `phone stand fold laptop` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `car vents phone mount gravity` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `phone lens kit macro fish` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `table phone holder flexible arm` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `wireless selfie stick tripod` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `cell phone stand table holder` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Phone Gadgets | `phone charging cable fast magnetic` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `keyboard cleaning brush kit` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `monitor light bar screenbar` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `laptop stand aluminum adjustable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `mouse pad wrist rest ergonomic` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `USB hub multiport adapter USB` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `web camera cover slide` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `laptop sleeve bag shockproof` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `trackball mouse ergonomic wireless` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `head phone hanger under desk` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `external SSD hard drive enclosure` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `USB desk fan quiet` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `mini microphone PC laptop` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `thermal paste syringe CPU` | 3 | 7 | 2 | 6 | 2 | 8 | 4 | 9 | **3.55** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| Computer Accessories | `keyboard wrist rest memory foam` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `USB light light flexible computer` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `laptop cooling pad stand` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `dust plugs laptop computer` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `monitor mount stand arm` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `wireless presenter pointer remote` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Computer Accessories | `keycap puller key extraction tool` | 7 | 7 | 2 | 6 | 2 | 8 | 4 | 3 | **4.85** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| Office Supplies | `desk organizer document holder` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `paper cutter paper trimmer` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `cable sleeve zipper management` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `seat cushion orthopedic memory` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `desk pad mat large leather` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `dry erase whiteboard magnetic` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `foot rest under desk office` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `notebook journal leather writing` | 7 | 7 | 3 | 3 | 7 | 8 | 9 | 3 | **5.10** | `REMOVE` | Standard office stationary lacks Telegram feed appeal and visual drive. |
| Office Supplies | `push pin clips wood pegs` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Office Supplies | `pen organizer desktop holder` | 7 | 7 | 3 | 3 | 7 | 8 | 9 | 3 | **5.10** | `REMOVE` | Standard office stationary lacks Telegram feed appeal and visual drive. |
| Office Supplies | `correction tape dispenser roller` | 7 | 7 | 3 | 3 | 7 | 8 | 9 | 3 | **5.10** | `REMOVE` | Standard office stationary lacks Telegram feed appeal and visual drive. |
| Office Supplies | `book stand holder adjustable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `document scanner bag travel` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `privacy stamp roller cover` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `stapler remover set office` | 7 | 7 | 3 | 3 | 7 | 8 | 9 | 3 | **5.10** | `REMOVE` | Standard office stationary lacks Telegram feed appeal and visual drive. |
| Office Supplies | `badge reel holder retractable ID` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `file folder expanding letter` | 7 | 7 | 3 | 3 | 7 | 8 | 9 | 3 | **5.10** | `REMOVE` | Standard office stationary lacks Telegram feed appeal and visual drive. |
| Office Supplies | `tape dispenser desk holder` | 7 | 7 | 3 | 3 | 7 | 8 | 9 | 3 | **5.10** | `REMOVE` | Standard office stationary lacks Telegram feed appeal and visual drive. |
| Office Supplies | `desk drawer organizer tray drawer` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Office Supplies | `gel pens set black blue` | 7 | 7 | 3 | 3 | 7 | 8 | 9 | 3 | **5.10** | `REMOVE` | Standard office stationary lacks Telegram feed appeal and visual drive. |
| Utility Lighting | `motion sensor light strip closet` | 10 | 10 | 10 | 9 | 7 | 10 | 4 | 2 | **9.10** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Utility Lighting | `under cabinet light rechargeable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `night light plug in sensor` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `book light clip on rechargeable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `sunset lamp projector light` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `flame light bulb LED fire` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `camping flashlight zoomable zoom` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `fairy lights battery operated LED` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `toilet bowl night light motion` | 10 | 10 | 10 | 9 | 7 | 10 | 4 | 2 | **9.10** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Utility Lighting | `desk lamp cordless rechargeable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `cabinet hinge light LED utility` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `motion sensor night light wall` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `projection clock ceiling projector` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `smart light bulb adapter wifi` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `solar deck lights outdoor fence` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `candle warmer lamp top heater` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `starlight projector galaxy laser` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `flexible strip light neon sign` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `mini flashlight keychain USB rechargeable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Utility Lighting | `step light indoor motion wall` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `solar motion light outdoor garden` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `plant watering spikes self water` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `garden grafting tool scissors kit` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Garden Tools | `drip irrigation kit system garden` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `solar fountain pump water bird` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `plant support clips trellis garden` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `soil moisture meter sensor meter` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `grow light strip USB timer` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `seed starter trays humidity dome` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `garden kneeler pad cushion foam` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `bird feeder hanger window bird` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `garden hose nozzle spray high` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `hanging planter basket hook chain` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `solar firefly lights garden pathway` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `plant root growing box grafting` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `branch cutter garden shear trimmer` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `solar ground lights disc lights` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `plant tags labels markers garden` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Garden Tools | `bug zapper solar lamp garden` | 3 | 7 | 7 | 6 | 7 | 8 | 4 | 9 | **5.30** | `REMOVE` | AliExpress results often low quality, gimmicky, or fail to meet expectations. |
| Garden Tools | `plant ties velcro soft roll` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `silicone sink faucet splash guard` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `toilet brush silicone holder soft` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `toothpaste squeegee roller wall mount` | 10 | 10 | 10 | 9 | 7 | 10 | 4 | 2 | **9.10** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Bathroom Utility | `bath pillow bathtub neck head` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `hair catcher shower drain protector` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `bathroom mirror anti fog spray` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `razor holder wall mount hook` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `toothbrush holder wall mount electric` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `soap dispenser wall mount manual` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Bathroom Utility | `shower head high pressure water` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `toilet seat lifter handle toilet` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `bathtub mat non slip suction` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `toilet paper holder shelf phone` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `vanity mirror lights LED strip` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `shower squeegee glass door cleaner` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `soap saver pad soap dish` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `bathroom shelf adhesive corner shower` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `hair dryer holder wall mount` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `toilet bowl deodorizer gel stamp` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bathroom Utility | `waterproof phone box bathroom wall` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `mesh laundry bags underwear bra` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `wool dryer balls natural softener` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `collapsible laundry basket space save` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `lint remover clothes fuzz shaver` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Laundry Helpers | `socks hanger multi clip drying` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `clothes folding board shirt flip` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Laundry Helpers | `laundry detergent sheet dispenser` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Laundry Helpers | `clothes drying rack sock hanger` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Laundry Helpers | `laundry beads cup storage bottle` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `ironing mat pad heat resistant` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `hanging laundry hamper door bag` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `washing machine feet pad anti` | 10 | 10 | 10 | 9 | 7 | 10 | 4 | 2 | **9.10** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Laundry Helpers | `lint trap net washing machine` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `shoe washing mesh bag laundry` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `clothes line portable travel clothes` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Laundry Helpers | `fabric steamer portable travel iron` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `clothespins pegs wooden plastic clamp` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Laundry Helpers | `hanger space saving magic hanger` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `lint roller set adhesive sheet` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Laundry Helpers | `washer lint remover floating ball` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee frother electric mixer` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee grinder manual hand crank` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `pour over coffee dripper cup` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee scale timer digital kitchen` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee tamper espresso powder hammer` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee distributor leveler tool espresso` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `reusable coffee capsule pod cup` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee syphon maker glass syphon` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee bag spoon clip` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `milk frothing pitcher stainless jug` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `espresso dosing ring magnetic funnel` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee filter holder rack wood` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `cup warmer mug heater coaster` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee stencil art template cake` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `espresso puck screen reuse metal` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `manual milk frother hand pump` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee mug travel vacuum double` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `cold brew coffee maker bottle` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `espresso cleaning brush grinder cleaning` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Coffee Gadgets | `coffee syrup dispenser bottle pump` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Baby Safety & Care | `baby corner protector table guard` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `cabinet locks child safety strap` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `silicone baby bib pocket bib` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `pacifier clip holder leash silicone` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby knee pads crawling helper` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby nasal aspirator hand bulb` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby bath thermometer floating toy` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `stroller organizer bag drink holder` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby bottle drying rack space` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `car window shades baby protection` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby finger toothbrush soft silicone` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby food grinder masher bowl` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `stroller hook hangers aluminum carabiner` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby bath visor cap ears` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `pacifier box travel case container` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby safety harness walking helper` | 7 | 8 | 5 | 5 | 4 | 4 | 4 | 6 | **5.20** | `IMPROVE` | Overly generic query; likely to return low-quality or irrelevant items. |
| Baby Safety & Care | `outlet plugs childproof cover wall` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby food storage container silicone` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby nail trimmer electric file` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Baby Safety & Care | `baby head protection pad backpack` | 7 | 8 | 5 | 5 | 4 | 8 | 4 | 3 | **5.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `magnetic drawing board sketch pad` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `LCD writing tablet digital board` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `wooden pattern blocks puzzle` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `balance stepping stones kids balance` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `wooden tangram puzzle brain teaser` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `coloring roll paper wall sticky` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `coin bank counter digital piggy` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `rocket launcher toy air pressure` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `kids binoculars outdoor explorer kit` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `play tent foldable kids pop` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `diamond painting stickers kits kids` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `bath toys organizer mesh bag` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `toddler cleaning set mini broom` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `water drawing book magic water` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `projection torch flashlight projector toy` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `bubble machine gun electric bubble` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `clay modeling set air dry` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `child height ruler wall hanging` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `kids watch analog teaching learning` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Kids Toys & Activity | `paper airplane launcher folding toy` | 7 | 6 | 7 | 8 | 5 | 8 | 4 | 3 | **6.45** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `resistance bands elastic loop exercise` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `ab roller wheel abdominal core` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `jump rope digital counter speed` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `grip strength trainer hand squeezer` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `yoga mat strap carrier bag` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `muscle roller massage stick roller` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `fitness tracker smart bracelet sleep` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `water bottle time marker leakproof` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `cooling towel quick dry sports` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `push up board stand` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `ankle straps cable machine attachment` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `running belt bag phone holder` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `barbell pad squat shoulder cushion` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `dual exercise sliders gym core` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `kinesiology tape sports tape muscle` | 7 | 6 | 4 | 5 | 5 | 8 | 8 | 3 | **5.20** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Fitness Accessories | `wrist wraps gym weight lifting` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `sweat wristbands headbands set sports` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `liquid chalk bottle gym weight` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `pilates ring dual grip circle` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Fitness Accessories | `exercise ball hand pump balance` | 7 | 6 | 6 | 5 | 5 | 8 | 4 | 3 | **5.80** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bicycle phone mount handlebar holder` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bike light USB rechargeable head` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bike saddle cushion gel seat` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bicycle lock chain combination lock` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bike tire pump portable mini` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `cycling gloves gel finger gloves` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bike bag frame tube bag` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bicycle water bottle cage holder` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bike mirror handlebar rearview mirror` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bike tool kit multitool wrench` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `cycling sunglasses polarized sports glasses` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bicycle bell ring loud brass` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bike wall mount rack wall` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bicycle fender guard mud guard` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `spoke lights wheel lights LED` | 7 | 7 | 2 | 5 | 2 | 8 | 4 | 3 | **4.70** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| Bicycle Gear | `bike chain lube clean dry` | 7 | 7 | 2 | 5 | 2 | 8 | 4 | 3 | **4.70** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| Bicycle Gear | `cycling leg warmers compression sleeve` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bike repair stand clamp stand` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `bicycle seat bag saddle wedge` | 7 | 7 | 5 | 5 | 4 | 8 | 4 | 3 | **5.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Bicycle Gear | `valve adapter converter presta schrader` | 7 | 7 | 2 | 5 | 2 | 8 | 4 | 3 | **4.70** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| BBQ Utilities | `meat claws shredder pulled pork` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `grill brush scraper stainless wire` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `bbq meat thermometer instant read` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `grill mat non stick mesh` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `silicone basting brush oil brush` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `burger press hamburger patty maker` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `bbq gloves heat resistant kitchen` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `skewer sticks metal barbecue needles` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `charcoal fire starter chimney charcoal` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `grill lights magnet magnetic base` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `grill cover waterproof heavy duty` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `bbq kabob grilling baskets steel` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `grill tongs locking kitchen tongs` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `bbq smoker box wood chips` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `salt pepper grinder wood mill` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `spray bottle for barbecue oil` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `corn on cob holders metal` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `bbq apron canvas utility apron` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `skewers rack barbecue frame stand` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| BBQ Utilities | `bbq cleaning brick block stone` | 7 | 7 | 6 | 6 | 5 | 8 | 4 | 3 | **6.10** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `vacuum storage bags space saving` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `shoe storage box clear stackable` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `storage organizer bins drawer organizer` | 7 | 8 | 7 | 6 | 9 | 4 | 4 | 6 | **6.50** | `IMPROVE` | Overly generic query; likely to return low-quality or irrelevant items. |
| Home Storage | `cosmetic display stand storage drawer` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `hat organizer hangers clip hooks` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `magnetic key holder cloud wall` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `tea bag organizer chest box` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `battery storage organizer case tester` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `file folder storage box desktop` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `tissue box holder storage compartment` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `storage box under bed folding` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `cable storage box wire management` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `pill organizer box travel weekly` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `pen organizer holder storage desk` | 7 | 8 | 4 | 6 | 9 | 8 | 8 | 3 | **6.25** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Home Storage | `jewelry roll organizer bag fold` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `canvas storage basket toy bin` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `coin holder case storage bank` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `knife organizer drawer insert tray` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `cup drying rack counter drainer` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Storage | `blanket storage bag zipper bag` | 7 | 8 | 7 | 6 | 9 | 8 | 4 | 3 | **7.05** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `magnetic cable organizer clip desktop` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `digital multimeter electrical tester pen` | 7 | 7 | 4 | 6 | 6 | 8 | 8 | 5 | **5.55** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Electronics Gadgets | `precision tweezers pack` | 7 | 7 | 4 | 6 | 6 | 8 | 8 | 5 | **5.55** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Electronics Gadgets | `magnifying glass hand loupe lens` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `digital voice recorder dictaphone record` | 3 | 7 | 6 | 6 | 6 | 8 | 4 | 9 | **4.95** | `REMOVE` | AliExpress results often low quality, gimmicky, or fail to meet expectations. |
| Electronics Gadgets | `USB adapter converter type c` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `wire tracker network cable tester` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `mini scale jewelry pocket digital` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `portable laser distance meter rangefinder` | 3 | 7 | 6 | 6 | 6 | 8 | 4 | 9 | **4.95** | `REMOVE` | AliExpress results often low quality, gimmicky, or fail to meet expectations. |
| Electronics Gadgets | `electronic scale kitchen luggage weight` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `wire connector term block solder` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `heat shrink tubing electrical wire` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `led tester detector backlight tester` | 7 | 7 | 2 | 6 | 2 | 8 | 4 | 5 | **4.75** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| Electronics Gadgets | `audio extractor splitter optical audio` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `bluetooth audio adapter receiver jack` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `mini stereo amplifier board audio` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `electronic organizer bag cable travel` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `battery capacity tester indicator power` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Electronics Gadgets | `digital microscope screen camera zoom` | 3 | 7 | 6 | 6 | 6 | 8 | 4 | 9 | **4.95** | `REMOVE` | AliExpress results often low quality, gimmicky, or fail to meet expectations. |
| Electronics Gadgets | `voltage test pen non contact` | 7 | 7 | 4 | 6 | 6 | 8 | 8 | 5 | **5.55** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Smart Home Controls | `smart plug socket wifi plug` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart switch button pusher remote` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `IR remote control smart hub` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart temperature humidity sensor zigbee` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart light switch wall panel` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart bulb holder wifi adapter` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `window sensor alarm wifi door` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart water leak detector alarm` | 3 | 7 | 6 | 6 | 6 | 8 | 4 | 9 | **4.95** | `REMOVE` | AliExpress results often low quality, gimmicky, or fail to meet expectations. |
| Smart Home Controls | `motion sensor alarm wifi battery` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart door lock card keyless` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart finger bot switch bot` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `wifi signal repeater range extender` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart led controller wifi dimmer` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart gas leak alarm gas` | 3 | 7 | 6 | 6 | 6 | 8 | 4 | 9 | **4.95** | `REMOVE` | AliExpress results often low quality, gimmicky, or fail to meet expectations. |
| Smart Home Controls | `smart radiator valve thermostat zigbee` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart curtain motor automatic curtain` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `wifi garage door opener remote` | 7 | 7 | 4 | 6 | 6 | 8 | 8 | 5 | **5.55** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Smart Home Controls | `smart siren alarm wifi sounder` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `zigbee gateway hub wireless bridge` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Smart Home Controls | `smart air quality monitor co2` | 7 | 7 | 6 | 6 | 6 | 8 | 4 | 5 | **6.15** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `emergency survival kit bag gear` | 7 | 7 | 7 | 6 | 7 | 4 | 4 | 6 | **6.05** | `IMPROVE` | Overly generic query; likely to return low-quality or irrelevant items. |
| Emergency & Safety | `hand crank radio solar emergency` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `tactical pen glass breaker weapon` | 7 | 7 | 4 | 6 | 7 | 8 | 8 | 3 | **5.80** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Emergency & Safety | `emergency whistle rescue loud whistle` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `space blanket emergency thermal foil` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `emergency ponchos rain coat gear` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `high visibility safety vest` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `window breaker seatbelt cutter tool` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `emergency water filter straw survival` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `portable chain saw wire pocket` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `tourniquet band emergency medical belt` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `led headlamp flashlight head lamp` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `glow sticks emergency lights chemical` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `multi tool pliers pocket multitool` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `fire emergency blanket glass fiber` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `waterproof matches container match stick` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `first aid kit bag empty` | 7 | 7 | 7 | 6 | 7 | 4 | 4 | 6 | **6.05** | `IMPROVE` | Overly generic query; likely to return low-quality or irrelevant items. |
| Emergency & Safety | `hand hand warmers reusable pocket` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `solar lighter outdoor fire starter` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Emergency & Safety | `emergency warning triangle red folding` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `key lock box wall mount` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `portable door lock travel lock` | 10 | 10 | 10 | 9 | 7 | 10 | 4 | 2 | **9.10** | `KEEP` | High conversion archetype: visual, solves a specific pain point, and cheap. |
| Home Security | `door stop alarm sensor alert` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `rf detector anti spy camera` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `window security locks safety sliding` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `smart key lock padlock fingerprint` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `simulated security camera dummy cam` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `personal alarm keychain safe sound` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `key finder bluetooth locator tracker` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `rfid blocking card sleeves protection` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `security lock cable steel cable` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `combination padlock luggage lock number` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `home lock box keys wall` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `door reinforcement lock secure latch` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `magnetic window sensors alarm sounder` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `warning stickers security alarm sign` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `biometric cabinet lock drawer file` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `hidden wall socket safe box` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `book safe combination dictionary safe` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Home Security | `security door stop bar bracket` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `mini light box photo studio` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `photo background paper studio backdrop` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `lens cleaning kit pen air` | 7 | 5 | 4 | 6 | 3 | 8 | 8 | 3 | **4.90** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Photography Accessories | `universal diffuser softbox flash reflector` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `camera wrist strap paracord neck` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `desk mount camera stand pole` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `camera tripod mount phone mount` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `lens filter case pouch wallet` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `green screen background chroma key` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `ring light phone selfie clip` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `memory card case waterproof box` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `step up ring filter step adapter` | 7 | 5 | 2 | 6 | 2 | 8 | 6 | 3 | **4.45** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| Photography Accessories | `mini tripod stand tabletop desktop` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `bounce card flash diffuser card` | 7 | 5 | 2 | 6 | 2 | 8 | 6 | 3 | **4.45** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| Photography Accessories | `camera rain cover waterproof coat` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `battery case holder aa aaa` | 7 | 5 | 4 | 6 | 3 | 8 | 8 | 3 | **4.90** | `REPLACE` | Highly saturated commodity; easily bought locally for pennies. |
| Photography Accessories | `hot shoe bubble level spirit` | 7 | 5 | 2 | 6 | 2 | 8 | 6 | 3 | **4.45** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| Photography Accessories | `camera mount holder clip clamp` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `softbox lighting kit mini studio` | 7 | 5 | 4 | 6 | 3 | 8 | 6 | 3 | **5.00** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Photography Accessories | `lens hood cover sun shade` | 7 | 5 | 2 | 6 | 2 | 8 | 6 | 3 | **4.45** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| Hand Tools | `magnetic screwdriver set precision kits` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `universal socket wrench multi tool` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `digital pocket scale gram scale` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `stud finder wall scanner detector` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `magnetic pickup tool telescoping stick` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `step drill bit wood drilling` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `deburring tool hand debur scraper` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `flexible extension drill bit hose` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `thread pitch gauge metric screw` | 7 | 9 | 2 | 6 | 2 | 8 | 4 | 3 | **5.15** | `REMOVE` | Niche replacement part/accessory; irrelevant to 98% of users. |
| Hand Tools | `center punch automatic spring loaded` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `tap and die set screw` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `wire twist tool drill driver` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `automatic wire stripper crimper plier` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `socket adapter impact driver hex` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `magnetic screwdriver ring magnetizer ring` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `hand riveter gun rivet tool` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `pocket hole jig kit joinery` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `right angle drill adapter hex` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `level tool pocket level bubble` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Hand Tools | `hex key wrench set allen` | 7 | 9 | 7 | 6 | 6 | 8 | 4 | 3 | **6.75** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `microfiber car drying towel towel` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `car washing mitt chenille glove` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `windshield glass water repellent spray` | 3 | 7 | 7 | 6 | 7 | 8 | 4 | 9 | **5.30** | `REMOVE` | AliExpress results often low quality, gimmicky, or fail to meet expectations. |
| Car Care & Polish | `clay bar car detailing clean` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `wheel rim cleaning brush wire` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `scratch repair cloth wax compound` | 3 | 7 | 4 | 6 | 7 | 8 | 8 | 9 | **4.50** | `REMOVE` | AliExpress results often low quality, gimmicky, or fail to meet expectations. |
| Car Care & Polish | `leather cleaner conditioner cream seat` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `foam lance soap bottle spray` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `micro fiber wax applicator pads` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `car cleaning brush vent detailing` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `car wash squeeze sprayer pump` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `car windshield repair kit crack` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `headlight restoration kit polish clean` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `plastic trim restorer agent polish` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `car interior cleaning gel slime` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `buffing pads drill polishing pad` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `rain repellent windshield wiper treatment` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `car dust duster static brush` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `tire valve cap metal tire` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
| Car Care & Polish | `wash bucket dirt trap filter` | 7 | 7 | 7 | 6 | 7 | 8 | 4 | 3 | **6.60** | `KEEP` | Decent utility product with acceptable audience relevance. |
