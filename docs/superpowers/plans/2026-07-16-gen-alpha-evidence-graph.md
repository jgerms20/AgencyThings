# Gen Alpha Evidence Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved evidence-backed Gen Alpha intelligence and strategy system with forty insights, deeper culture shapers, fifty spaces, Reach Them, Compare, source drill-down, and fully verified production behavior.

**Architecture:** A typed canonical content graph in `src/lib/content/` owns sources, evidence, themes, insights, culture shapers, spaces, strategy plays, and comparisons. Server components query the graph through selectors; small client components own local filtering, tabs, tooltips, and mobile navigation. Runtime validators and tests enforce every count, reference, evidence, rubric, and comparison invariant.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Testing Library, lucide-react, CSS modules through the existing global stylesheet, privacy-enhanced YouTube embeds.

## Global Constraints

- Exactly four themes exist with exactly ten insights per theme.
- AI is a cross-cutting tag, never a standalone theme.
- Every insight has at least two evidence items from two distinct direct sources.
- Every metric exposes population, age, geography, time period, methodology, and limitations.
- Influencer indicator tiers are 1-4 and always include rubric text, rationale, and source references.
- Exactly fifty spaces exist; unsupported entries are visibly marked as editorial watchlist items.
- Reach Them recommendations cite evidence and include ethical constraints.
- Compare distinguishes age-matched evidence, current cohort snapshots, and directional interpretation.
- Search-result URLs are prohibited.
- No new runtime dependency is added.
- Light and dark themes remain functional.
- Layouts support 320px and wider without horizontal overflow.

---

## File Structure

- `src/lib/content/types.ts`: canonical entity and ID types.
- `src/lib/content/sources.ts`: normalized source records.
- `src/lib/content/evidence.ts`: extracted metrics and qualitative claims.
- `src/lib/content/insights.ts`: four themes and forty insights.
- `src/lib/content/culture-shapers.ts`: creators, artists, athletes, properties, and franchises.
- `src/lib/content/spaces.ts`: fifty evidence-aware spaces.
- `src/lib/content/strategy.ts`: eight Reach Them plays.
- `src/lib/content/comparisons.ts`: ten Gen Alpha and Gen Z dimensions.
- `src/lib/content/selectors.ts`: graph lookup helpers.
- `src/lib/content/validate.ts`: referential and completeness validation.
- `src/components/InsightDetail.tsx`: evidence-led insight drill-down.
- `src/components/InfluencerFilters.tsx`: client-side culture-shaper filters.
- `src/components/IndicatorTooltip.tsx`: accessible rubric explanation.
- `src/components/SpaceFilters.tsx`: client-side fifty-space filters.
- `src/components/ReachPage.tsx`: strategy experience.
- `src/components/ComparePage.tsx`: comparison experience.
- `src/components/SourceDetail.tsx`: extracted source evidence.
- `src/components/MobileNav.tsx`: compact navigation at small widths.

### Task 1: Canonical Content Types, Sources, Evidence, And Validation

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/content/types.ts`
- Create: `apps/gen-alpha-lab/src/lib/content/sources.ts`
- Create: `apps/gen-alpha-lab/src/lib/content/evidence.ts`
- Create: `apps/gen-alpha-lab/src/lib/content/selectors.ts`
- Create: `apps/gen-alpha-lab/src/lib/content/validate.ts`
- Create: `apps/gen-alpha-lab/tests/content-graph.test.ts`

**Interfaces:**
- Produces: `Source`, `EvidenceItem`, `Theme`, `Insight`, `getSource(id)`, `getEvidenceForInsight(id)`, `validateContentGraph()`.
- Consumes: no new application interfaces.

- [ ] **Step 1: Write failing graph-validation tests**

```ts
import { describe, expect, it } from "vitest";
import { evidenceItems } from "@/lib/content/evidence";
import { sources } from "@/lib/content/sources";
import { validateContentGraph } from "@/lib/content/validate";

describe("canonical content graph", () => {
  it("stores direct evidence with explicit scope and limitations", () => {
    expect(sources.length).toBeGreaterThanOrEqual(25);
    expect(evidenceItems.length).toBeGreaterThanOrEqual(80);
    for (const item of evidenceItems) {
      expect(item.population).toBeTruthy();
      expect(item.ageRange).toBeTruthy();
      expect(item.geography).toBeTruthy();
      expect(item.period).toBeTruthy();
      expect(item.methodology).toBeTruthy();
      expect(item.limitations).toBeTruthy();
    }
  });

  it("has no graph validation issues", () => {
    expect(validateContentGraph()).toEqual([]);
  });
});
```

- [ ] **Step 2: Run `npm test -- --run tests/content-graph.test.ts` and verify it fails with unresolved content modules.**
- [ ] **Step 3: Implement canonical types, at least 25 normalized direct sources, at least 80 extracted evidence items, selectors, and validation for direct URLs, unique IDs, source references, and required evidence scope fields.**
- [ ] **Step 4: Run the focused test and verify it passes.**
- [ ] **Step 5: Commit with `git commit -m "Build Gen Alpha evidence graph foundation"`.**

### Task 2: Four Themes, Forty Insights, Overview, And Insight Detail

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/content/insights.ts`
- Create: `apps/gen-alpha-lab/src/components/InsightDetail.tsx`
- Create: `apps/gen-alpha-lab/src/app/insights/[insightId]/page.tsx`
- Modify: `apps/gen-alpha-lab/src/components/InsightTabs.tsx`
- Modify: `apps/gen-alpha-lab/src/components/InsightsPage.tsx`
- Modify: `apps/gen-alpha-lab/src/components/LabWorkspace.tsx`
- Modify: `apps/gen-alpha-lab/src/lib/editorial.ts`
- Modify: `apps/gen-alpha-lab/src/lib/findings.ts`
- Create: `apps/gen-alpha-lab/tests/insight-graph.test.tsx`

**Interfaces:**
- Consumes: `Source`, `EvidenceItem`, `getEvidenceForInsight` from Task 1.
- Produces: `themes`, `insights`, `getInsight(id)`, `getInsightsForTheme(id)`, and forty static `/insights/[insightId]` routes.

- [ ] **Step 1: Write failing tests asserting four theme IDs (`play-belonging`, `media-influence`, `time-routines`, `learning-becoming`), ten insights per theme, forty unique detail links, two distinct source IDs per insight, AI only as a tag, and visible evidence methodology on detail pages.**
- [ ] **Step 2: Run `npm test -- --run tests/insight-graph.test.tsx tests/editorial.test.ts tests/insights-page.test.tsx tests/lab-workspace.test.tsx` and verify count and route failures.**
- [ ] **Step 3: Implement the exact forty insight titles and theme assignments from the approved spec, connect evidence IDs, add confidence/nuance/comparison/strategy fields, and create selectors.**
- [ ] **Step 4: Update the overview so each theme shows one lead data point, four supporting headlines, an evidence count, and a link to all ten; replace AI & Agency with Learning & Becoming.**
- [ ] **Step 5: Build the insight directory and detail route with evidence ledger, methodology, limitations, counterpoint, related entities, and direct source links.**
- [ ] **Step 6: Run focused tests and the full test suite; verify all pass.**
- [ ] **Step 7: Commit with `git commit -m "Expand Gen Alpha to forty sourced insights"`.**

### Task 3: Culture Shapers, Filters, Rubrics, And Embedded Media

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/content/culture-shapers.ts`
- Create: `apps/gen-alpha-lab/src/components/InfluencerFilters.tsx`
- Create: `apps/gen-alpha-lab/src/components/IndicatorTooltip.tsx`
- Modify: `apps/gen-alpha-lab/src/lib/influencers.ts`
- Modify: `apps/gen-alpha-lab/src/components/PeoplePage.tsx`
- Modify: `apps/gen-alpha-lab/src/components/InfluencerDetail.tsx`
- Modify: `apps/gen-alpha-lab/src/app/influencers/[influencerId]/page.tsx`
- Create: `apps/gen-alpha-lab/tests/culture-shapers.test.tsx`

**Interfaces:**
- Consumes: canonical source and insight IDs.
- Produces: `CultureShaper`, `IndicatorAssessment`, `cultureShapers`, `getCultureShaper(id)`, and filters for type, age, topic, platform, format, and audience segment.

- [ ] **Step 1: Write failing tests for the five culture-shaper types, every filter dimension, women and girl-focused representation, multiple videos, indicator tiers 1-4, rubric definitions, profile rationale, source IDs, hover/focus tooltip access, and internal profile links.**
- [ ] **Step 2: Run `npm test -- --run tests/culture-shapers.test.tsx tests/people-page.test.tsx tests/influencer-detail.test.tsx` and verify failures.**
- [ ] **Step 3: Migrate the existing thirty creators and add sourced artists, athletes, screen properties, and franchises, including Bluey and KPop Demon Hunters as evidence-backed screen/IP examples.**
- [ ] **Step 4: Implement local filters with native buttons/selects, result counts, and a clear-all control; filters must not cause layout shift or horizontal scrolling.**
- [ ] **Step 5: Implement the indicator rubric and accessible lucide info trigger using `aria-describedby`, hover, focus, and persistent visible text on profile detail.**
- [ ] **Step 6: Expand profiles with topics, formats, audience context, influence mechanism, moments, related entities, sources, and privacy-enhanced lazy video embeds.**
- [ ] **Step 7: Run focused and full tests; verify all pass.**
- [ ] **Step 8: Commit with `git commit -m "Deepen Gen Alpha culture shaper intelligence"`.**

### Task 4: Fifty Evidence-Aware Spaces

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/content/spaces.ts`
- Create: `apps/gen-alpha-lab/src/components/SpaceFilters.tsx`
- Modify: `apps/gen-alpha-lab/src/lib/spaces.ts`
- Modify: `apps/gen-alpha-lab/src/components/SpacesPage.tsx`
- Modify: `apps/gen-alpha-lab/src/components/LabWorkspace.tsx`
- Modify: `apps/gen-alpha-lab/tests/spaces.test.ts`
- Modify: `apps/gen-alpha-lab/tests/spaces-page.test.tsx`

**Interfaces:**
- Consumes: source, evidence, insight, and culture-shaper IDs.
- Produces: exactly fifty `Space` records and filters by category, environment, and age.

- [ ] **Step 1: Update tests to require exactly fifty unique spaces, the six spec categories, explicit evidence/watchlist status, at least one source per evidence-backed space, and the fields `whyTheyGo`, `whatHappens`, `whoIsThere`, `evidenceSummary`, `strategyRelevance`, and `safetyCaveat`.**
- [ ] **Step 2: Add component tests proving filters work and the phrase `What it enables` is absent.**
- [ ] **Step 3: Run focused tests and verify failures against the twelve-space implementation.**
- [ ] **Step 4: Implement the exact fifty-space roster from the approved spec with age context, evidence status, source IDs, and concise non-repetitive explanations.**
- [ ] **Step 5: Build category/environment/age filters and rewrite space rows around Why they go, What happens there, Evidence, Strategy, and Safety.**
- [ ] **Step 6: Run focused and full tests; verify all pass.**
- [ ] **Step 7: Commit with `git commit -m "Expand Gen Alpha spaces to fifty"`.**

### Task 5: Reach Them Strategy Layer

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/content/strategy.ts`
- Create: `apps/gen-alpha-lab/src/components/ReachPage.tsx`
- Create: `apps/gen-alpha-lab/src/app/reach-them/page.tsx`
- Create: `apps/gen-alpha-lab/tests/reach-page.test.tsx`

**Interfaces:**
- Consumes: canonical insight, source, space, and culture-shaper IDs.
- Produces: exactly eight `StrategyPlay` records and `/reach-them`.

- [ ] **Step 1: Write failing tests requiring the eight exact strategy play titles from the spec, age context, evidence rationale, formats, failure modes, ethical constraints, and valid related entity references.**
- [ ] **Step 2: Run `npm test -- --run tests/reach-page.test.tsx` and verify the missing-route failure.**
- [ ] **Step 3: Implement strategy data and a full-width editorial page that connects each play to supporting evidence, spaces, shapers, useful formats, and visible ethical boundaries.**
- [ ] **Step 4: Run focused and full tests; verify all pass.**
- [ ] **Step 5: Commit with `git commit -m "Add responsible Gen Alpha reach strategy"`.**

### Task 6: Gen Alpha And Gen Z Comparison

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/content/comparisons.ts`
- Create: `apps/gen-alpha-lab/src/components/ComparePage.tsx`
- Create: `apps/gen-alpha-lab/src/app/compare/page.tsx`
- Create: `apps/gen-alpha-lab/tests/compare-page.test.tsx`

**Interfaces:**
- Consumes: source and evidence IDs.
- Produces: ten `ComparisonDimension` records and `/compare`.

- [ ] **Step 1: Write failing tests for the ten exact comparison dimensions, both cohort summaries, comparison class, age, geography, source year, caveat, and dimension switching.**
- [ ] **Step 2: Run `npm test -- --run tests/compare-page.test.tsx` and verify the missing-route failure.**
- [ ] **Step 3: Implement comparisons using age-matched Pew/Common Sense series where available, current cohort snapshots where necessary, and directional interpretation only when visibly labeled.**
- [ ] **Step 4: Build a keyboard-accessible dimension selector and two-column desktop/single-column mobile comparison rail with methodology caveats always visible.**
- [ ] **Step 5: Run focused and full tests; verify all pass.**
- [ ] **Step 6: Commit with `git commit -m "Add evidence-aware generation comparison"`.**

### Task 7: Library Source Detail And Podcast Integration

**Files:**
- Create: `apps/gen-alpha-lab/src/components/SourceDetail.tsx`
- Create: `apps/gen-alpha-lab/src/app/library/[sourceId]/page.tsx`
- Modify: `apps/gen-alpha-lab/src/components/LibraryPage.tsx`
- Modify: `apps/gen-alpha-lab/src/components/LabWorkspace.tsx`
- Create: `apps/gen-alpha-lab/tests/source-detail.test.tsx`
- Modify: `apps/gen-alpha-lab/tests/library-page.test.tsx`

**Interfaces:**
- Consumes: canonical sources, evidence items, and insight selectors.
- Produces: source detail routes for all canonical sources.

- [ ] **Step 1: Write failing tests for population, methodology, evidence count, themes, strength label, extracted evidence, related insights, direct links, and privacy-enhanced YouTube embeds.**
- [ ] **Step 2: Add a failing overview assertion that `Joshua's point of view` is absent and `Listen to understand them more` is present.**
- [ ] **Step 3: Run focused tests and verify failures.**
- [ ] **Step 4: Build source cards and detail routes, preserving existing All/Reports/Articles/Books/Podcasts/Videos filters.**
- [ ] **Step 5: Update podcast copy and preserve the Spotify destination.**
- [ ] **Step 6: Run focused and full tests; verify all pass.**
- [ ] **Step 7: Commit with `git commit -m "Connect library sources to extracted evidence"`.**

### Task 8: Navigation, Responsive Visual System, And Accessibility

**Files:**
- Create: `apps/gen-alpha-lab/src/components/MobileNav.tsx`
- Modify: `apps/gen-alpha-lab/src/components/SiteHeader.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Modify: `apps/gen-alpha-lab/tests/detail-pages.test.tsx`
- Create: `apps/gen-alpha-lab/tests/navigation.test.tsx`

**Interfaces:**
- Consumes: seven route definitions.
- Produces: responsive navigation and shared layout styling for all new surfaces.

- [ ] **Step 1: Write failing tests for all seven navigation destinations, active state, mobile open/close state, Escape dismissal, and visible link access without horizontal scrolling.**
- [ ] **Step 2: Run `npm test -- --run tests/navigation.test.tsx tests/detail-pages.test.tsx` and verify failures.**
- [ ] **Step 3: Implement a lucide Menu/Close mobile control and semantic navigation; keep the full link set visible on desktop.**
- [ ] **Step 4: Extend the editorial CSS with stable grids, responsive embeds, filters, evidence ledgers, comparison rails, focus states, tooltips, and 320px reflow. Do not add gradients, horizontal scrollers, nested cards, or viewport-scaled font sizes.**
- [ ] **Step 5: Run focused and full tests; verify all pass.**
- [ ] **Step 6: Commit with `git commit -m "Finish Gen Alpha responsive navigation and visuals"`.**

### Task 9: Full Verification, Browser QA, And Production Publication

**Files:**
- Create: `docs/superpowers/qa/2026-07-16-gen-alpha-evidence-graph-qa.md`
- Modify only files required by concrete verification findings.

**Interfaces:**
- Consumes: the completed application.
- Produces: verification evidence, PR, merged `main`, and stable production deployment.

- [ ] **Step 1: Run `npm test -- --run`; expect every test file and test to pass with zero failures.**
- [ ] **Step 2: Run `npm run build`; expect successful TypeScript, static generation, and all dynamic insight, influencer, and source routes.**
- [ ] **Step 3: Run `git diff --check`; expect no output and exit code 0.**
- [ ] **Step 4: Start the local dev server on an available port and use the in-app browser for desktop 1440x1000, tablet 1024x768, mobile 390x844, and mobile 320x760.**
- [ ] **Step 5: Verify all routes, navigation, forty insight links, evidence ledgers, filters, tooltips, multiple embeds, fifty spaces, strategy links, comparison switching, library source pages, theme switching, keyboard access, image loading, console output, and zero horizontal overflow.**
- [ ] **Step 6: Record route-by-route results and any repaired findings in the QA document.**
- [ ] **Step 7: Commit verification repairs and QA evidence.**
- [ ] **Step 8: Push the feature branch, open a ready PR, wait for every Vercel check, merge to `main`, and wait for the production deployment.**
- [ ] **Step 9: Verify the stable Vercel URL with HTTP checks and production browser QA across representative dynamic routes.**
- [ ] **Step 10: Audit every specification requirement against code, tests, build output, browser evidence, PR state, and production behavior before marking the goal complete.**
