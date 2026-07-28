# Gen Alpha Gender Rooms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the House into two distinct evidence-led room lenses and reshape the Intelligence Lab into a concise, editable, presentation-ready research experience with deeper gender evidence.

**Architecture:** Keep the two existing Next.js apps and deployments separate. The House receives a typed `RoomLens` data model that swaps artwork, objects, copy, and hotspots as one state transition; the Lab extends its existing content modules and replaces the briefing surface with a client-side editable Summary whose defaults remain versioned in code and whose user edits persist locally.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Testing Library, CSS, localStorage, static Vercel deployments.

## Global Constraints

- Preserve `apps/gen-alpha-house` and `apps/gen-alpha-lab` as separate apps and Vercel projects.
- Treat gender as a research lens, never an individual prediction or a pink/blue stereotype.
- Use direct child research where available and label teen evidence as a near-age proxy.
- Keep all controls keyboard accessible, responsive, and compatible with reduced motion.
- Do not add new runtime dependencies.

---

### Task 1: Dual evidence-led House rooms

**Files:**
- Modify: `apps/gen-alpha-house/src/lib/house-types.ts`
- Modify: `apps/gen-alpha-house/src/lib/house-data.ts`
- Modify: `apps/gen-alpha-house/src/lib/house-state.ts`
- Modify: `apps/gen-alpha-house/src/components/HouseExperience.tsx`
- Modify: `apps/gen-alpha-house/src/components/HouseCanvas.tsx`
- Modify: `apps/gen-alpha-house/src/components/InsightDrawer.tsx`
- Modify: `apps/gen-alpha-house/src/components/ObjectIndex.tsx`
- Modify: `apps/gen-alpha-house/src/app/globals.css`
- Create: `apps/gen-alpha-house/public/gen-alpha-girls-bedroom.png`
- Test: `apps/gen-alpha-house/tests/house-data.test.ts`
- Test: `apps/gen-alpha-house/tests/house-experience.test.tsx`

**Interfaces:**
- Produces: `RoomLensId = "boys" | "girls"`, `RoomLens`, `roomLenses`, `getRoomLens(id)`, `countLinkedInsights(lensId)`.
- Consumes: existing `RoomObject`, `LinkedInsight`, `HouseCanvas`, `InsightDrawer`, and Lab URLs.

- [ ] **Step 1: Write failing data tests**

Add literal assertions that both room lenses exist, each has nine uniquely positioned objects, each has an `influencer-poster`, the two object collections are different references with gender-specific copy, and all external source/profile/insight URLs are valid.

- [ ] **Step 2: Run the House tests and verify RED**

Run: `npm test -- --run tests/house-data.test.ts tests/house-experience.test.tsx`

Expected: FAIL because `roomLenses`, room toggles, nine numbered hotspots, and girls-room artwork do not exist.

- [ ] **Step 3: Implement the typed room-lens model and UI**

Define two complete lens records. Give each room nine coherent objects: phone, television, homework desk, game console, backpack, toy/book shelf, caregiver door, outside window, and influencer poster. Use current primary research in the displayed findings, add direct source URLs and Lab deep links, persist the selected room in the session, close the drawer when switching rooms, and render `01`–`09` inside the hotspot circles.

- [ ] **Step 4: Install and wire the generated girls-room asset**

Copy the accepted 3:2 generated image into `public/gen-alpha-girls-bedroom.png`, retain the existing image as the boys-room asset, and align each hotspot to the corresponding visible object.

- [ ] **Step 5: Run the focused House tests and verify GREEN**

Run: `npm test -- --run tests/house-data.test.ts tests/house-experience.test.tsx`

Expected: 2 files pass with room switching, numbered hotspots, source links, and influencer-poster behavior covered.

### Task 2: Expand the Lab gender evidence

**Files:**
- Modify: `apps/gen-alpha-lab/src/lib/gender-lens.ts`
- Modify: `apps/gen-alpha-lab/src/components/GenderLensPage.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Test: `apps/gen-alpha-lab/tests/gender-lens.test.tsx`

**Interfaces:**
- Produces: five or more `GenderFinding` records for each lens, optional contradiction labels, and direct source links.
- Consumes: Pew Research Center, Common Sense Media, Ofcom, CDC, and Trevor Project source URLs.

- [ ] **Step 1: Write failing gender-lens tests**

Assert at least five findings for boys, girls, and gender-diverse youth; direct-child statistics for boys and girls; contradiction framing; a girls-first default; source links; and the absence of stereotype/exclusivity claims.

- [ ] **Step 2: Run the focused Lab test and verify RED**

Run: `npm test -- --run tests/gender-lens.test.tsx`

Expected: FAIL because each lens currently has three findings and the expanded fields/content are absent.

- [ ] **Step 3: Implement the evidence expansion and spatial redesign**

Add direct-child Ofcom/Common Sense findings, teen proxy context, and gender-diverse visibility/safety/evidence-gap findings. Make Girls the initial tab, widen the opening composition, create stronger separation between thesis and explanation, and keep methods and guardrails visible without crowding the hero.

- [ ] **Step 4: Run the focused Lab test and verify GREEN**

Run: `npm test -- --run tests/gender-lens.test.tsx`

Expected: all gender-lens assertions pass.

### Task 3: Replace Briefing with an editable Summary

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/summary.ts`
- Create: `apps/gen-alpha-lab/src/components/SummaryPage.tsx`
- Create: `apps/gen-alpha-lab/src/app/summary/page.tsx`
- Modify: `apps/gen-alpha-lab/src/app/briefing/page.tsx`
- Modify: `apps/gen-alpha-lab/src/components/SiteHeader.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Replace test: `apps/gen-alpha-lab/tests/briefing-page.test.tsx`
- Modify test: `apps/gen-alpha-lab/tests/navigation.test.tsx`

**Interfaces:**
- Produces: `summaryTakeaways`, versioned localStorage record `gen-alpha-summary-v1`, edit/save/reset controls, `/summary`, and a `/briefing` redirect.
- Consumes: exact insight routes and direct research-source URLs.

- [ ] **Step 1: Write failing Summary and navigation tests**

Assert the nav labels `Ways in` and `Summary`; six succinct takeaways; editable headline and takeaway fields; local persistence; reset behavior; direct insight/source links; and no `talk-ready`, `Say it this way`, `Briefing`, or bike-window language.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm test -- --run tests/briefing-page.test.tsx tests/navigation.test.tsx`

Expected: FAIL because `/summary`, editing, persistence, and the new labels do not exist.

- [ ] **Step 3: Implement Summary and legacy redirect**

Build a clean presentation view with one bold headline, one editable takeaway, two short support points, exact insight link, and source links per conclusion. Replace the bike conclusion with household context. Keep edit controls out of print and redirect `/briefing` to `/summary`.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run: `npm test -- --run tests/briefing-page.test.tsx tests/navigation.test.tsx`

Expected: both files pass.

### Task 4: Move source weighting to Library and fully collapse Ways in

**Files:**
- Modify: `apps/gen-alpha-lab/src/components/LibraryPage.tsx`
- Modify: `apps/gen-alpha-lab/src/components/ReachPage.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Modify: `apps/gen-alpha-lab/tests/library-page.test.tsx`
- Modify: `apps/gen-alpha-lab/tests/reach-page.test.tsx`

**Interfaces:**
- Consumes: `validityLadder` or a renamed shared evidence-weight model.
- Produces: Library evidence-weight disclosure and fully collapsed strategy-play summaries.

- [ ] **Step 1: Write failing Library and Ways-in tests**

Assert the Library owns `How this Lab weights evidence` and all five evidence levels. Assert every strategy play is closed initially, summaries show only number/title/one-line promise, and child value/best fit/guardrail/evidence appear only inside the expanded content.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- --run tests/library-page.test.tsx tests/reach-page.test.tsx`

Expected: FAIL because source weighting is still on Briefing and the first strategy play/details are partially exposed.

- [ ] **Step 3: Implement the disclosure hierarchy**

Move the validity ladder into Library under a concise `Dig into the evidence yourself` introduction. Remove default-open strategy details and move all supporting fields below the disclosure boundary while preserving evidence links and safety checks.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm test -- --run tests/library-page.test.tsx tests/reach-page.test.tsx`

Expected: both files pass.

### Task 5: Simplify Compare, verify, publish, and inspect live

**Files:**
- Modify: `apps/gen-alpha-lab/src/components/ComparePage.tsx`
- Modify: `apps/gen-alpha-lab/tests/compare-page.test.tsx`
- Modify: `apps/gen-alpha-house/README.md`
- Modify: `apps/gen-alpha-lab/README.md`

**Interfaces:**
- Produces: concise comparison result, collapsed detailed evidence/methodology, direct source links, and related-insight links.

- [ ] **Step 1: Write failing Compare tests**

Assert the visible result contains two concise mentality statements, evidence-status labels, one bold difference, direct source links, related insight links, and a closed `Evidence and limits` disclosure containing metadata and caveats.

- [ ] **Step 2: Run the focused Compare test and verify RED**

Run: `npm test -- --run tests/compare-page.test.tsx`

Expected: FAIL because metadata, evidence, and caveats are always expanded and related insight links are missing.

- [ ] **Step 3: Implement the compact comparison surface**

Keep the existing comparison data and selectors, reduce default-visible copy, add a topic-to-insight route, and place evidence records, locators, metadata, and caveats inside one native disclosure.

- [ ] **Step 4: Run full verification**

Run in each app: `npm test -- --run`, `npm run build`, and `git diff --check` from the worktree root.

Expected: all House and Lab tests pass, both static production builds complete, and the diff check is clean.

- [ ] **Step 5: Commit, push, deploy, and browser-verify**

Commit the feature branch, push it, open a pull request, deploy both Vercel projects from their app directories, and verify both stable aliases at desktop and mobile sizes. Check room switching, numbered hotspots, influencer drawers, editable Summary persistence, gender tabs, collapsed plays, Library validity disclosure, Compare disclosure, media loads, console errors, and horizontal overflow.
