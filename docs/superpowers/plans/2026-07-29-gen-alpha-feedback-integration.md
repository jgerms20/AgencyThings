# Gen Alpha Feedback Integration Implementation Plan

> **Execution note:** Implement on `codex/gen-alpha-gender-rooms` and extend PR #26. Preserve both separately deployed Vercel apps.

**Goal:** Make the Lab a credible U.S.-first baseline knowledge system with a clear research frontier, while making both rooms more human, transparent, and useful.

**Architecture:** Extend the existing content-first Next.js apps. Add small typed editorial datasets and reusable scope/status UI rather than introducing a CMS or changing persistence. Keep the House as an experiential companion and the Lab as the evidence system.

**Tech stack:** Next.js, React, TypeScript, Vitest, Testing Library, existing CSS and Lucide icon system.

---

## Task 1: Establish behavior with tests

**Lab tests:**
- Update overview tests to require a 101 opening and ten fast facts.
- Update reach/navigation tests to require “Marketing 101” framing.
- Update compare tests to require examples and caveats.
- Update library tests to require market controls and visible source geography.
- Update summary tests to require the research frontier and pending proprietary inputs.

**House tests:**
- Require the composite-room disclosure.
- Require market and evidence-status labels in insight drawers.
- Require a creator-to-cart working hunch in both room datasets.

Run the focused tests and confirm they fail for the expected missing behavior.

## Task 2: Add Lab editorial models and content

**Files:**
- Add `apps/gen-alpha-lab/src/lib/gen-alpha-101.ts`.
- Add `apps/gen-alpha-lab/src/lib/research-frontier.ts`.
- Extend source geography in `apps/gen-alpha-lab/src/lib/content/types.ts` and `sources.ts`.
- Humanize `apps/gen-alpha-lab/src/lib/content/comparisons.ts`.

Keep data typed, concise, source-linked, and explicit about direct evidence versus interpretation.

## Task 3: Recompose Lab surfaces

**Files:**
- Update `LabWorkspace.tsx` with a 101-first opening and three-stage knowledge map.
- Rename the nav and `ReachPage.tsx` framing to Marketing 101.
- Update `OverviewComparison.tsx` and `ComparePage.tsx` for concrete examples and caveats.
- Update `LibraryPage.tsx` with market filtering and source-scope display.
- Update `SummaryPage.tsx` with the research frontier and proprietary-input queue.
- Extend `globals.css` without replacing the existing visual system.

Run the full Lab test suite and build.

## Task 4: Deepen House transparency and commerce logic

**Files:**
- Extend House insight types with market and evidence status.
- Update `house-data.ts` to tag all findings and add creator-to-cart working hunches.
- Update `HouseExperience.tsx` with the composite-room/gender-data disclosure.
- Update `InsightDrawer.tsx` to show market, age/proxy, and evidence status clearly.
- Extend House CSS using existing drawer and lens patterns.

Run the full House test suite and build.

## Task 5: Visual and interaction QA

- Run both apps locally.
- Verify Lab overview, Marketing 101, Compare, Summary, and Library on desktop and mobile.
- Verify both room lenses, representative drawers, scope labels, theme toggle, and source links on desktop and mobile.
- Capture screenshots and inspect them for hierarchy, overflow, wrapping, contrast, and interaction regressions.
- Fix all material issues and rerun tests/builds.

## Task 6: Publish

- Review the final diff and run `git diff --check`.
- Commit the scoped changes to `codex/gen-alpha-gender-rooms`.
- Push the branch so PR #26 updates.
- Deploy both apps to their existing Vercel projects.
- Verify stable production aliases return 200 and perform a compact live browser check.
