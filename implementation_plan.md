# Implementation Plan - Discovery V2.1 Library Update

Update the product search discovery library database configuration to V2.1, introducing weighted category distributions, replacing generic commodities with long-tail high-potential problem solvers, and removing technical replacement components.

## User Review Required

> [!IMPORTANT]
> - **Category Weight Stability**: No category weights (`weight`) or scheduler parameters are changed. We preserve all 30 categories.
> - **Variable Category Sizes**: Tiers are used as guidelines. Keyword counts vary from 10 to 25 depending on category opportunity, yielding a total of **507 unique keywords** (down from 600) without duplicate entries.
> - **Validation Tests**: We will modify `scripts/test-discovery.ts` to assert V2.1 invariants (exactly 30 categories, 507 unique keywords, matching counts per category, no duplicate normalized keywords globally).

---

## Open Questions

None.

---

## Proposed Changes

### Discovery Component

#### [MODIFY] [discovery-config.ts](file:///c:/Users/Oz/Desktop/affiliate_content_engine/src/features/discovery/discovery-config.ts)
- Update the `discoveryLibraryV2` configuration structure to use the V2.1 weighted categories.
- Assign the exact list of keywords to each category according to the verified draft.
- Retain all 30 categories with their original scheduling weights.

---

## Verification Plan

### Automated Tests
- Update `scripts/test-discovery.ts` to validate V2.1 constraints (30 categories, 507 unique keywords total, no duplicates, matching keyword count per category).
- Run full discovery test suite:
  ```powershell
  npx tsx scripts/test-discovery.ts
  ```
- Run code quality validation:
  ```powershell
  npm run lint
  npm run build
  ```
