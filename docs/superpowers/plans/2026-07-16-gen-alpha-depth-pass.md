# Gen Alpha Depth Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich the Gen Alpha Lab with deeper culture and media coverage while making Insights, Reach, Compare, and the Overview easier to scan and interact with.

**Architecture:** Extend the canonical content graph and record types first, then build shared embed/disclosure components consumed by Overview, Library, Insights, Spaces, and Reach. Preserve static generation and validate all new references before rendering.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library, CSS, Spotify embeds, YouTube privacy-enhanced embeds.

## Global Constraints

- Preserve the accepted high-contrast visual language and evidence graph.
- Do not claim child audience demographics that the cited research does not measure.
- Use test-first development for every behavior change.
- Keep embeds lazy, responsive, and useful when external playback fails.
- No broken imagery, horizontal overflow, framework overlays, or relevant console errors.

---

### Task 1: Extend taxonomy and graph validation

**Files:**
- Modify: `apps/gen-alpha-lab/src/lib/content/culture-shapers.ts`
- Modify: `apps/gen-alpha-lab/src/lib/content/types.ts`
- Modify: `apps/gen-alpha-lab/src/lib/content/validate.ts`
- Modify: `apps/gen-alpha-lab/src/components/InfluencerFilters.tsx`
- Test: `apps/gen-alpha-lab/tests/culture-shapers.test.tsx`
- Test: `apps/gen-alpha-lab/tests/content-graph.test.ts`

- [ ] Write failing tests for a user-facing IP filter, merged screen/franchise results, and minimum counts of 30 artists, 12 athletes, and 12 IP records.
- [ ] Run the focused tests and confirm failures identify the missing taxonomy/count behavior.
- [ ] Add the smallest taxonomy/selectors/validation changes that satisfy the tests while preserving existing routes.
- [ ] Run focused tests and commit the green graph boundary.

### Task 2: Enrich culture shapers and imagery

**Files:**
- Modify: `apps/gen-alpha-lab/src/lib/content/culture-shapers.ts`
- Modify: `apps/gen-alpha-lab/src/components/InfluencerDetail.tsx`
- Modify: `apps/gen-alpha-lab/src/components/PeoplePage.tsx`
- Add/modify: `apps/gen-alpha-lab/public/culture/**`
- Modify: `apps/gen-alpha-lab/public/creators/ATTRIBUTION.md`
- Test: `apps/gen-alpha-lab/tests/culture-shapers.test.tsx`
- Test: `apps/gen-alpha-lab/tests/influencer-detail.test.tsx`

- [ ] Write failing tests for complete artist/athlete/IP profiles, portrait fallback behavior, and featured IP imagery.
- [ ] Run focused tests and confirm the new records/asset behavior are missing.
- [ ] Add diverse, evidence-aware profiles and attributed artwork; use explicit editorial confidence where direct audience data are unavailable.
- [ ] Run focused tests, scan asset references, and commit.

### Task 3: Add shared playable media components and library content

**Files:**
- Create: `apps/gen-alpha-lab/src/components/MediaEmbed.tsx`
- Modify: `apps/gen-alpha-lab/src/lib/seed-data.ts`
- Modify: `apps/gen-alpha-lab/src/lib/findings.ts`
- Modify: `apps/gen-alpha-lab/src/components/LibraryPage.tsx`
- Test: `apps/gen-alpha-lab/tests/library-page.test.tsx`
- Test: `apps/gen-alpha-lab/tests/findings.test.ts`

- [ ] Write failing tests for filter order, ten podcasts, seven videos, featured Eclectic Polymath treatment, Spotify embed URLs, and privacy-enhanced YouTube embeds.
- [ ] Run focused tests and confirm expected failures.
- [ ] Implement `MediaEmbed`, add researched records, and render playable library cards with graceful links.
- [ ] Run focused tests and commit.

### Task 4: Make Insights expandable

**Files:**
- Create: `apps/gen-alpha-lab/src/components/InsightDirectory.tsx`
- Modify: `apps/gen-alpha-lab/src/components/InsightsPage.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Test: `apps/gen-alpha-lab/tests/insights-page.test.tsx`

- [ ] Write failing keyboard and disclosure tests for quick-hit interpretation, nuance, confidence, and the full-detail link.
- [ ] Run focused tests and confirm directory rows are currently static.
- [ ] Implement an accessible one-open-per-theme disclosure without changing insight detail routes.
- [ ] Run focused tests and commit.

### Task 5: Enrich Spaces with physical places and usage media

**Files:**
- Modify: `apps/gen-alpha-lab/src/lib/content/spaces.ts`
- Modify: `apps/gen-alpha-lab/src/components/SpacesPage.tsx`
- Modify: `apps/gen-alpha-lab/src/components/SpaceFilters.tsx`
- Test: `apps/gen-alpha-lab/tests/spaces-page.test.tsx`
- Test: `apps/gen-alpha-lab/tests/spaces.test.ts`

- [ ] Write failing tests for additional physical spaces and selected usage-video links/embeds.
- [ ] Run focused tests and confirm missing records/media.
- [ ] Extend space records and render media only for the expanded active item to keep the directory light.
- [ ] Run focused tests and commit.

### Task 6: Simplify How to reach them

**Files:**
- Modify: `apps/gen-alpha-lab/src/components/SiteHeader.tsx`
- Modify: `apps/gen-alpha-lab/src/components/ReachPage.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Test: `apps/gen-alpha-lab/tests/navigation.test.tsx`
- Test: `apps/gen-alpha-lab/tests/reach-page.test.tsx`

- [ ] Write failing tests for the new nav copy, concise default play summaries, first-play default expansion, and supporting detail disclosures.
- [ ] Run focused tests and confirm current long-form output fails the contract.
- [ ] Recompose Reach into bold summary bands with optional evidence/detail regions and a concise safety standard.
- [ ] Run focused tests and commit.

### Task 7: Rebuild Compare as a cohort and topic tool

**Files:**
- Modify: `apps/gen-alpha-lab/src/lib/content/comparisons.ts`
- Modify: `apps/gen-alpha-lab/src/lib/content/types.ts`
- Modify: `apps/gen-alpha-lab/src/components/ComparePage.tsx`
- Modify: `apps/gen-alpha-lab/src/lib/content/validate.ts`
- Test: `apps/gen-alpha-lab/tests/compare-page.test.tsx`
- Test: `apps/gen-alpha-lab/tests/content-graph.test.ts`

- [ ] Write failing tests for Gen Z, Gen X, and Boomer cohort selection; three topics; strategic difference copy; stats; sources; and interpretation labels.
- [ ] Run focused tests and confirm the current two-cohort model fails.
- [ ] Extend comparison types/data and implement a single coherent result panel driven by topic and cohort controls.
- [ ] Run focused tests and commit.

### Task 8: Upgrade Overview as the front door

**Files:**
- Modify: `apps/gen-alpha-lab/src/components/LabWorkspace.tsx`
- Modify: `apps/gen-alpha-lab/src/components/InsightTabs.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Test: `apps/gen-alpha-lab/tests/lab-workspace.test.tsx`

- [ ] Write failing tests for the new editorial title, Spotify embed, three reach disclosures, topic comparison, and ten-item media shelf.
- [ ] Run focused tests and confirm missing Overview systems.
- [ ] Compose the Overview from the shared graph, embed, comparison, and disclosure APIs.
- [ ] Run focused tests and commit.

### Task 9: Validate, visually test, review, and publish

**Files:**
- Modify: `docs/superpowers/qa/2026-07-16-gen-alpha-depth-pass-qa.md`

- [ ] Run `npm test` and require zero failures.
- [ ] Run `npm run build` and require all static routes to generate.
- [ ] Run `git diff --check` and graph/asset scans.
- [ ] Start the app and test Overview, Insights disclosure, IP filtering, artist/athlete/IP details, Spaces media, Reach disclosure, Compare controls, and Library embeds in the in-app Browser at desktop and 320px.
- [ ] Inspect console warnings/errors, screenshots, overflow, broken images, and playable media states; fix and repeat until clean.
- [ ] Request final independent review, record evidence in the QA file, push a PR, merge after checks, and verify the stable production URL.

