# Walkthrough — Discovery V2.1 Library Update

We have successfully executed the **Discovery V2.1 Library Update** migration, verified it with all V2.1 automated invariants, and published two live deals to the Telegram channel.

---

## 1. V2.1 Category Migration Summary

Category weights (`weight` in `discoveryLibraryV2`) are preserved exactly to keep scheduler behavior stable. The number of keywords inside each category is adjusted dynamically based on product opportunities:

| Category ID | Old Count | New Count | Removed | Replaced | Added | Weight |
|---|---|---|---|---|---|---|
| `kitchen` | 20 | 25 | 0 | 5 | 5 | 10 |
| `car` | 20 | 25 | 2 | 10 | 7 | 10 |
| `home` | 20 | 22 | 0 | 0 | 2 | 9 |
| `cleaning` | 20 | 20 | 0 | 1 | 1 | 8 |
| `organization` | 20 | 22 | 0 | 0 | 2 | 8 |
| `diy` | 20 | 15 | 5 | 1 | 0 | 7 |
| `travel` | 20 | 20 | 0 | 0 | 0 | 8 |
| `camping` | 20 | 18 | 2 | 0 | 0 | 8 |
| `pets` | 20 | 18 | 2 | 0 | 0 | 6 |
| `phone` | 20 | 12 | 8 | 0 | 0 | 7 |
| `computer` | 20 | 12 | 8 | 0 | 0 | 6 |
| `office` | 20 | 12 | 8 | 1 | 0 | 6 |
| `lighting` | 20 | 25 | 0 | 0 | 5 | 9 |
| `garden` | 20 | 14 | 6 | 0 | 0 | 8 |
| `bathroom` | 20 | 20 | 0 | 0 | 0 | 7 |
| `laundry` | 20 | 14 | 6 | 0 | 0 | 7 |
| `coffee` | 20 | 12 | 8 | 0 | 0 | 6 |
| `baby` | 20 | 14 | 6 | 0 | 0 | 5 |
| `kids` | 20 | 14 | 6 | 0 | 0 | 5 |
| `fitness` | 20 | 12 | 8 | 0 | 0 | 5 |
| `bicycle` | 20 | 12 | 8 | 0 | 0 | 5 |
| `bbq` | 20 | 12 | 8 | 0 | 0 | 6 |
| `storage` | 20 | 20 | 0 | 1 | 1 | 8 |
| `electronics` | 20 | 18 | 2 | 0 | 0 | 7 |
| `smarthome` | 20 | 25 | 0 | 0 | 5 | 7 |
| `emergency` | 20 | 15 | 5 | 0 | 0 | 6 |
| `security` | 20 | 15 | 5 | 0 | 0 | 6 |
| `photography` | 20 | 10 | 10 | 0 | 0 | 4 |
| `tools` | 20 | 20 | 0 | 0 | 0 | 7 |
| `car_care` | 20 | 14 | 6 | 0 | 0 | 8 |

### V2.1 Library Totals
* **Old Total**: `600` keywords
* **New Total**: `507` keywords
* **Removed**: `121` keywords
* **Replaced**: `19` keywords
* **Added**: `28` keywords

---

## 2. Invariant & Test Verification

All automated checks pass successfully. The `scripts/test-discovery.ts` test file was updated to assert:
- Exactly **30 categories** exist.
- Exactly **507 unique keywords** exist globally.
- Categorized keyword counts match their V2.1 target sizes exactly.
- Duplication checks pass (zero normalized duplicate keywords globally).
- Legacy V1 isolation remains 100% intact (exactly 6 legacy strategies).

```bash
# Test command output:
Test 17: V2 Discovery Library structure, metadata, and V1 compatibility checks
All tests completed successfully!
```

---

## 3. Live Telegram Publish Runs
Using the updated V2.1 rotation:

1. **Deal 1 — Car Care (`car_care` category)**:
   - *Product External ID*: `1005005913678483`
   - *Product Title*: `"3 Inch Car Headlight Restoration Kit with Drill Buffing Sponge Polishing Pads Headlight Lens Cleaner and Restorer,37PCS"`
   - *Telegram Message ID*: `1782`
   - *Publish Type*: `photo` (with clean bold headline, RTL price block, and CTA)

2. **Deal 2 — Cleaning Tools (`cleaning` category)**:
   - *Product External ID*: `1005004325707271`
   - *Product Title*: `"Window Mesh Screen Brush Curtain Net Wipe Cleaner Carpet Brush Dust Removal Brush Home Retractable Long Handle Cleaning Tools"`
   - *Telegram Message ID*: `1783`
   - *Publish Type*: `photo`
