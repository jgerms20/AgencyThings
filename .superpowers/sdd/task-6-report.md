# Task 6 Report: Simplify How to reach them

## Status

DONE_WITH_CONCERNS

## Delivered

- Changed the exact navigation label to `How to reach them` while preserving `/reach-them`.
- Reframed Reach around three high-level stages: Create value, Fit the context, and Apply guardrails.
- Preserved all eight canonical strategy plays in their original order and grouped them 2 / 4 / 2 across the stages.
- Replaced the long index and default essay layout with native `details` / `summary` disclosures. The first play defaults open; the remaining seven default closed.
- Limited each default summary to number/title, child value, best-fit context, and one guardrail.
- Limited expanded content to two formats, up to two supporting insights, up to two source records, and two safety constraints.
- Kept the four non-negotiable boundaries in a compact band.
- Added explicit single-column Reach overrides at 700px and below, covering 320px layouts without fixed multi-column text tracks.

## TDD Evidence

- RED: focused tests failed on the old `Reach Them` label, old page heading, absent stages/disclosures, visible long-form content, and missing phone-width CSS contract.
- GREEN: `npm test -- tests/navigation.test.tsx tests/reach-page.test.tsx`
  - 2 test files passed
  - 14 tests passed

## Verification

- `npm test -- tests/navigation.test.tsx tests/reach-page.test.tsx` - PASS (14/14)
- `git diff --check` - PASS
- `npx tsc --noEmit` - BLOCKED by four unrelated/concurrent test type errors:
  - `tests/compare-page.test.tsx:75` missing `summary` on `CohortUnderTest`
  - `tests/content-graph.test.ts:638` source id used where a theme id is expected
  - `tests/insight-graph.test.tsx:68-69` comparisons against unsupported `ai` theme value

## Concerns

- Task 6 focused behavior is green, but the repository-wide TypeScript check is not currently clean because of concurrent work outside this task's write scope.
