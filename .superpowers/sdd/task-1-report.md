# Task 1 Report: Extend taxonomy and graph validation

## Outcome

Implemented the Task 1 taxonomy boundary for the Gen Alpha Lab:

- Added an IP directory filter that combines `screen-ip` and `franchise` records while retaining the underlying taxonomy.
- Added type-safe directory filter and culture-shaper taxonomy types.
- Expanded the canonical content graph to 30 artists, 12 athletes, and 12 IP records.
- Added validation floors for those editorial coverage minimums.

## Red

Command:

```sh
cd /private/tmp/gen-alpha-depth-pass/apps/gen-alpha-lab
npm test -- --run tests/culture-shapers.test.tsx tests/content-graph.test.ts
```

Result: failed as intended, with 5 failures across 2 test files.

- Coverage test reported 2 artists where at least 30 were required.
- IP filter test found the existing `Screen / IP` control instead of the single merged `IP` control.
- Three graph validation tests reported that the expected artist, athlete, and IP floor errors were absent.

## Green

Command:

```sh
cd /private/tmp/gen-alpha-depth-pass/apps/gen-alpha-lab
npm test -- --run tests/culture-shapers.test.tsx tests/content-graph.test.ts
```

Result: passed, 2 test files and 87 tests.

Additional check:

```sh
git -C /private/tmp/gen-alpha-depth-pass diff --check
```

Result: passed with no whitespace errors.

## Changed Files

- `apps/gen-alpha-lab/src/lib/content/culture-shapers.ts`
- `apps/gen-alpha-lab/src/lib/content/types.ts`
- `apps/gen-alpha-lab/src/lib/content/validate.ts`
- `apps/gen-alpha-lab/src/components/InfluencerFilters.tsx`
- `apps/gen-alpha-lab/tests/culture-shapers.test.tsx`
- `apps/gen-alpha-lab/tests/content-graph.test.ts`

## Self-review

- The IP selector tests both the UI contract and merged result set, while keeping `screen-ip` and `franchise` distinct in canonical data.
- Graph validation emits clear floor-specific errors and the canonical graph validates cleanly through the focused suite.
- New coverage records label their audience range as low-confidence editorial orientation and explicitly avoid claiming property-specific child demographics.
- Existing routes remain unchanged because all records continue using `/influencers/[id]` and the existing detail shape.

## Commit

Pending commit at the time this report was written.

## Concerns

- A production build was started but did not produce a `BUILD_ID` artifact in this concurrent worktree; focused Task 1 tests are green. The build result is not included as acceptance evidence.
