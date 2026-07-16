# Task 4 Report: Expandable Insights

## Scope

- Added `apps/gen-alpha-lab/src/components/InsightDirectory.tsx`.
- Updated `apps/gen-alpha-lab/src/components/InsightsPage.tsx` to render the directory.
- Added insight-directory-only responsive disclosure styles in `apps/gen-alpha-lab/src/app/globals.css`.
- Extended `apps/gen-alpha-lab/tests/insights-page.test.tsx`.

## TDD Evidence

1. Added keyboard/disclosure tests before production implementation.
2. The first focused test run had a test parse error; corrected the assertion syntax without changing production code.
3. The corrected red run failed as expected because the existing directory exposed static links instead of insight disclosure buttons.
4. Implemented the smallest client-side disclosure directory: every theme tracks its own open insight ID, so opening another row within that theme closes the prior row.
5. A green run exposed a region naming issue caused by the visible sequence number. The component now labels both trigger and region from the title-only span.
6. A second green run exposed a test matcher limitation for mixed inline confidence text. The assertion now checks the rendered paragraph text without weakening the UI markup.
7. Focused tests passed after the responsive CSS review.

## Behavior Delivered

- Each of the 40 insight rows is a native button with `aria-expanded` and `aria-controls`.
- Keyboard Enter activates the focused row through native button behavior.
- Expanded rows expose the existing interpretation, nuance, confidence, and a full-detail link to the unchanged `/insights/[insightId]` route.
- Only one row may be open within each theme; separate themes retain independent disclosure state.
- Tablet and narrow-mobile styles use constrained grid tracks and single-column details to avoid horizontal overflow.

## Verification

Passed:

```text
npm test -- tests/insights-page.test.tsx
Test Files  1 passed (1)
Tests  3 passed (3)
```

Passed:

```text
git diff --check
```

Blocked by concurrent work outside Task 4:

```text
npx tsc --noEmit
```

The typecheck reports errors in concurrent Task 1 and Task 5 work: `culture-shapers.ts`, `validate.ts`, `content-graph.test.ts`, `insight-graph.test.tsx`, and `spaces.test.ts`. It reports no errors in Task 4 files.

## Self-Review

- Preserved the four theme groupings, all 40 records, and all insight detail routes.
- Used an isolated client component so `InsightsPage` remains a simple server-rendered page shell.
- Kept styles limited to insight-directory selectors and their responsive overrides.
- Did not alter or stage concurrent changes.

## Review Remediation Evidence

- Restored a visible `:focus-visible` outline for the full-detail link.
- Every disclosure panel remains rendered while collapsed with its `hidden` attribute set, so each trigger's `aria-controls` references an existing panel.
- Added coverage proving all 40 collapsed triggers reference hidden panels and that themes retain separate open rows while each theme remains one-open-at-a-time.

Passed exactly:

```text
npm test -- tests/insights-page.test.tsx

Test Files  1 passed (1)
Tests  4 passed (4)
```

Passed exactly:

```text
git diff --check

(exit code 0; no output)
```
