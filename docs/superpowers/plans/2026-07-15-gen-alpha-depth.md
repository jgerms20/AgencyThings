# Gen Alpha Intelligence Depth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Gen Alpha briefing into ten insights, thirty influencer profiles, twelve digital spaces, and a format-filtered research library.

**Architecture:** Keep research evidence in the existing findings and seed-record layers. Add focused static editorial modules for influencers and spaces, thin Next.js routes, and page-specific components. Preserve the current visual system and redirect the legacy People route.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Testing Library, Lucide React, CSS.

## Global Constraints

- Primary navigation is Overview, Insights, Influencers, Spaces, and Library.
- The homepage has four tabs and AI is the last tab.
- The site contains exactly ten editorial insights, thirty influencer profiles, and twelve space profiles.
- Featured influencer profiles and eligible Library video records use responsive, lazy-loaded embeds.
- Make, Think, and Learn are removed from the Library.
- Existing evidence links, dark/light theme behavior, and separate Vercel deployment remain intact.
- No gradients, horizontal scrollers, nested cards, or viewport-scaled typography.

---

### Task 1: Lock the expanded editorial contracts

**Files:**
- Modify: `apps/gen-alpha-lab/tests/editorial.test.ts`
- Modify: `apps/gen-alpha-lab/tests/findings.test.ts`
- Create: `apps/gen-alpha-lab/tests/spaces.test.ts`
- Create: `apps/gen-alpha-lab/src/lib/influencers.ts`
- Create: `apps/gen-alpha-lab/src/lib/spaces.ts`
- Modify: `apps/gen-alpha-lab/src/lib/editorial.ts`
- Modify: `apps/gen-alpha-lab/src/lib/findings.ts`

**Interfaces:**
- Produces: `insightTabs`, `editorialInsights`, `influencers`, `getInfluencerById`, `spaces`, `LibraryFormat`, `filterLibraryByFormat`.

- [ ] Write tests asserting four tabs, ten insights, thirty unique influencers, twelve unique spaces, and complete profile fields.
- [ ] Run `npm test -- --run tests/editorial.test.ts tests/findings.test.ts tests/spaces.test.ts` and confirm the new assertions fail.
- [ ] Implement the data modules and lookup/filter helpers with Play and Belonging first and AI and Agency last.
- [ ] Run the focused tests and confirm they pass.

### Task 2: Build overview tabs and the complete Insights page

**Files:**
- Modify: `apps/gen-alpha-lab/tests/lab-workspace.test.tsx`
- Create: `apps/gen-alpha-lab/tests/insights-page.test.tsx`
- Modify: `apps/gen-alpha-lab/src/components/LabWorkspace.tsx`
- Create: `apps/gen-alpha-lab/src/components/InsightTabs.tsx`
- Create: `apps/gen-alpha-lab/src/components/InsightsPage.tsx`
- Create: `apps/gen-alpha-lab/src/app/insights/page.tsx`

**Interfaces:**
- Consumes: `insightTabs` and `editorialInsights`.
- Produces: keyboard-accessible tab selection and `/insights` rendering of all ten findings.

- [ ] Write component tests for the default first tab, tab switching, insight counts, and the ten-insight directory.
- [ ] Run the focused tests and confirm they fail.
- [ ] Implement the shared tab component, homepage synthesis, and full Insights page.
- [ ] Run the focused tests and confirm they pass.

### Task 3: Build the Influencers directory and profile routes

**Files:**
- Modify: `apps/gen-alpha-lab/tests/people-page.test.tsx`
- Create: `apps/gen-alpha-lab/tests/influencer-detail.test.tsx`
- Modify: `apps/gen-alpha-lab/src/components/PeoplePage.tsx`
- Create: `apps/gen-alpha-lab/src/components/InfluencerDetail.tsx`
- Modify: `apps/gen-alpha-lab/src/app/people/page.tsx`
- Create: `apps/gen-alpha-lab/src/app/influencers/page.tsx`
- Create: `apps/gen-alpha-lab/src/app/influencers/[influencerId]/page.tsx`
- Add: `apps/gen-alpha-lab/public/creators/*.jpg`

**Interfaces:**
- Consumes: `influencers` and `getInfluencerById`.
- Produces: a thirty-profile directory, internal profile routes, and static params.

- [ ] Write tests for thirty profiles, featured five, internal links, profile indicators, audience, and key moments.
- [ ] Run the focused tests and confirm they fail.
- [ ] Implement the directory, detail page, redirect, portrait assets, and privacy-enhanced featured video embeds.
- [ ] Run the focused tests and confirm they pass.

### Task 4: Build the Spaces intelligence page

**Files:**
- Create: `apps/gen-alpha-lab/tests/spaces-page.test.tsx`
- Create: `apps/gen-alpha-lab/src/components/SpacesPage.tsx`
- Create: `apps/gen-alpha-lab/src/app/spaces/page.tsx`

**Interfaces:**
- Consumes: `spaces`.
- Produces: twelve visible space rows with behavior, audience, implication, and sources.

- [ ] Write a component test asserting Roblox, YouTube, Discord, and all twelve rows.
- [ ] Run the focused test and confirm it fails.
- [ ] Implement the page with distinct high-contrast rows and evidence links.
- [ ] Run the focused test and confirm it passes.

### Task 5: Replace Library use modes with format tabs

**Files:**
- Modify: `apps/gen-alpha-lab/tests/library-page.test.tsx`
- Modify: `apps/gen-alpha-lab/src/components/LibraryPage.tsx`
- Modify: `apps/gen-alpha-lab/src/lib/findings.ts`
- Modify: `apps/gen-alpha-lab/src/lib/seed-data.ts`

**Interfaces:**
- Consumes: `getLibrarySections` and `filterLibraryByFormat`.
- Produces: All, Reports, Articles, Books, Podcasts, and Videos filter states.

- [ ] Replace use-mode test expectations with exact format-filter behavior, video embed behavior, and no Make, Think, or Learn controls.
- [ ] Run the focused test and confirm it fails.
- [ ] Implement unique format classification, responsive YouTube previews, filtered groups, and additional credible records.
- [ ] Run the focused test and confirm it passes.

### Task 6: Integrate navigation and responsive styling

**Files:**
- Modify: `apps/gen-alpha-lab/src/components/SiteHeader.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Modify: `apps/gen-alpha-lab/src/app/layout.tsx`

**Interfaces:**
- Consumes: all new routes and component class names.
- Produces: coherent desktop/mobile navigation and page-specific editorial layouts.

- [ ] Update navigation tests to expect five visible internal destinations.
- [ ] Implement five-link navigation, focus states, responsive wrapping, tabs, profile indicators, and space rows.
- [ ] Run the complete test suite and production build.
- [ ] Verify no gradients, horizontal scrollers, or generated Next.js file churn.

### Task 7: Browser QA and publication

**Files:**
- Create: `docs/superpowers/qa/2026-07-15-gen-alpha-depth-qa.md`

**Interfaces:**
- Produces: a recorded browser verification matrix and production deployment evidence.

- [ ] Run the local production-equivalent site and verify Overview, Insights, Influencers, one influencer detail, Spaces, and every Library filter on desktop.
- [ ] Repeat the navigation and interaction checks at 390px mobile with zero horizontal overflow and zero failed images.
- [ ] Check theme switching and browser console output.
- [ ] Record results, commit, push, open a PR, wait for checks, merge, and verify the stable Vercel routes.
