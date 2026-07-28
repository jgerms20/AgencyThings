# Gen Alpha Insight Room Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a single-room, object-led Gen Alpha House; add the House to the Agency Things hub; and add sourced gender and briefing views to the Intelligence Lab.

**Architecture:** Keep all three deploys independent in the same repository. The House owns a small typed object-to-insight map and links into the Lab; the Lab owns the analytical gender, briefing, and validity content; the static hub only owns product discovery.

**Tech Stack:** Static HTML/CSS/ES modules for the hub; Next.js 16, React 19, TypeScript, Lucide, Vitest, and Testing Library for the House and Lab; Vercel for the two Gen Alpha apps; GitHub Pages packaging for the hub.

## Global Constraints

- Preserve `https://agencythings-gen-alpha.vercel.app` and `https://agencythings-gen-alpha-house.vercel.app` as separate production projects.
- Use exactly one Gen Alpha bedroom with eight meaningful object bundles and no six-room navigator.
- Every House insight card must link to an existing Lab insight ID.
- Gender-diverse evidence must label older-youth proxies and non-probability samples; never invent Gen Alpha prevalence.
- Reuse the Lab's methodology, population, age, geography, fieldwork, confidence, and limitations fields.
- Keep existing upload APIs, database schema, evidence graph, and current routes working.
- Preserve light/dark themes, keyboard access, mobile access, and reduced-motion support.

---

### Task 1: Add Gen Alpha House to the Agency Things hub

**Files:**
- Modify: `tests/agencythings-hub.test.mjs`
- Modify: `assets/hub.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `projects` registry and `data-project`/`data-directory-project` markup contract.
- Produces: project id `gen-alpha-house` with URL `https://agencythings-gen-alpha-house.vercel.app`.

- [ ] **Step 1: Update hub tests to require seven projects and both Gen Alpha destinations**

Add expected registry entry:

```js
{
  id: "gen-alpha-house",
  name: "Gen Alpha House",
  type: "Interactive Field Guide",
  mode: "learn",
  purpose: "Explore Gen Alpha research through the objects in one lived-in room.",
  href: "https://agencythings-gen-alpha-house.vercel.app",
  external: true,
}
```

Assert seven `data-recent-status` and seven `data-directory-project` elements and both Gen Alpha URLs.

- [ ] **Step 2: Run the hub test and verify the new assertions fail**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: FAIL because the project registry and markup still contain six tools.

- [ ] **Step 3: Add the project registry entry and matching hub markup**

Insert the House immediately after the Intelligence Lab, renumber later visible project symbols, and add the directory entry with an accessible launch label.

- [ ] **Step 4: Run the hub tests and Pages builder**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: 8 tests pass and the built hub contains both Gen Alpha links.

- [ ] **Step 5: Commit**

```bash
git add assets/hub.js index.html tests/agencythings-hub.test.mjs
git commit -m "feat: add Gen Alpha House to AgencyThings hub"
```

### Task 2: Replace the House room model with object bundles

**Files:**
- Modify: `apps/gen-alpha-house/src/lib/house-types.ts`
- Modify: `apps/gen-alpha-house/src/lib/house-data.ts`
- Modify: `apps/gen-alpha-house/src/lib/house-state.ts`
- Modify: `apps/gen-alpha-house/tests/house-data.test.ts`

**Interfaces:**
- Produces: `RoomObject`, `LinkedInsight`, `roomObjects`, `getRoomObject(id)`, and `countLinkedInsights()`.
- `RoomObject` contains `id`, `label`, `object`, `title`, `thesis`, `context`, `accent`, `position`, and `insights: LinkedInsight[]`.
- `LinkedInsight` contains `id`, `title`, `thesis`, `confidence`, `evidenceCount`, `scope`, `sources`, and `labUrl`.

- [ ] **Step 1: Replace data tests with the new object contract**

Assert exactly eight unique objects, at least three unique insight links per object, no ambient-only items, valid `/insights/<id>` URLs, and a total linked-insight count of at least 24.

- [ ] **Step 2: Run the data test and verify it fails against the room model**

Run: `npm test -- --run tests/house-data.test.ts`

Expected: FAIL because `roomObjects` and `countLinkedInsights` do not exist.

- [ ] **Step 3: Implement the typed object bundles**

Create eight objects: `phone`, `television`, `homework-desk`, `game-console`, `backpack`, `toy-shelf`, `parent-door`, and `bike-window`. Curate every linked ID from the Lab's existing 40-insight graph.

- [ ] **Step 4: Run the data tests**

Run: `npm test -- --run tests/house-data.test.ts`

Expected: all House data tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/gen-alpha-house/src/lib apps/gen-alpha-house/tests/house-data.test.ts
git commit -m "feat: map room objects to sourced insights"
```

### Task 3: Create and implement the single-bedroom House experience

**Files:**
- Create: `apps/gen-alpha-house/public/gen-alpha-bedroom.png`
- Modify: `apps/gen-alpha-house/src/components/HouseCanvas.tsx`
- Modify: `apps/gen-alpha-house/src/components/HouseExperience.tsx`
- Modify: `apps/gen-alpha-house/src/components/InsightDrawer.tsx`
- Delete: `apps/gen-alpha-house/src/components/RoomNavigator.tsx`
- Modify: `apps/gen-alpha-house/src/app/globals.css`
- Modify: `apps/gen-alpha-house/tests/house-experience.test.tsx`

**Interfaces:**
- Consumes: `roomObjects: RoomObject[]` from Task 2.
- Produces: eight accessible object controls and a drawer with multiple individually linked insight cards.

- [ ] **Step 1: Generate the complete bedroom artwork**

Use Image Gen to create one wide nighttime bedroom with a visible phone, TV, laptop/homework desk, game console/headset, backpack/notebook, toy/story shelf, open parent-facing door, and window showing a bike and yard. No people, text, labels, hotspot dots, or interface chrome are baked into the image.

- [ ] **Step 2: Write failing interaction tests**

Assert the page has no `House rooms` navigation, selecting `Open game console insights` renders at least three insight links, every link has a unique Lab route, and the mobile object index contains all eight objects.

- [ ] **Step 3: Run the interaction test and verify it fails**

Run: `npm test -- --run tests/house-experience.test.tsx`

Expected: FAIL because the old component still renders room navigation and one drawer CTA.

- [ ] **Step 4: Implement the single-room canvas and multi-insight drawer**

Remove `selectedRoom`, room translation, and `RoomNavigator`. Render one pulse per `RoomObject`, show source/confidence/scope metadata on each insight card, and preserve Escape/backdrop dismissal and theme behavior.

- [ ] **Step 5: Implement responsive object access**

Below 720px, crop the image around the active object and render a compact eight-object index below the image. The index opens the same drawer and is not a second navigation hierarchy.

- [ ] **Step 6: Run all House tests and build**

Run: `npm test && npm run build`

Expected: all tests pass and `/` statically prerenders.

- [ ] **Step 7: Commit**

```bash
git add apps/gen-alpha-house
git commit -m "feat: rebuild Gen Alpha House as one insight room"
```

### Task 4: Add typed gender-lens research content

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/content/gender-lens.ts`
- Modify: `apps/gen-alpha-lab/src/lib/content/sources.ts`
- Create: `apps/gen-alpha-lab/tests/gender-lens.test.ts`

**Interfaces:**
- Produces: `genderLensTabs`, `genderFindings`, `getGenderFindings(lensId)`, and `GenderFinding`.
- `GenderFinding` contains `id`, `lens`, `title`, `metric`, `interpretation`, `sourceId`, `population`, `ageRange`, `geography`, `fieldworkPeriod`, `methodology`, `limitation`, and `validityBand`.

- [ ] **Step 1: Write failing content tests**

Assert four tabs (`all`, `boys`, `girls`, `gender-diverse`), at least three findings per tab, direct source URLs, complete scope/method fields, and `proxy` or `directional` labeling for every gender-diverse finding.

- [ ] **Step 2: Run the content test and verify it fails**

Run: `npm test -- --run tests/gender-lens.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Add current primary and transparent research sources**

Add scoped source records for Pew 2024 teen gaming, Pew 2024 teen social platforms, Ofcom 2025/26 children and parents media use, Common Sense/Hopelab 2024 diverse youth social media, and Trevor Project 2024 LGBTQ+ youth. Record probability/non-probability method, sample, ages, geography, fieldwork, and limitations.

- [ ] **Step 4: Implement gender findings and caveats**

Use reported boys/girls language only where the source does. Use the gender-diverse tab for inclusion and safety implications, with explicit older-youth or non-probability proxy labels.

- [ ] **Step 5: Run the content test**

Run: `npm test -- --run tests/gender-lens.test.ts`

Expected: all gender content tests pass.

- [ ] **Step 6: Commit**

```bash
git add apps/gen-alpha-lab/src/lib/content apps/gen-alpha-lab/tests/gender-lens.test.ts
git commit -m "feat: add sourced Gen Alpha gender lens"
```

### Task 5: Build the Gender Lens route and navigation

**Files:**
- Create: `apps/gen-alpha-lab/src/app/gender/page.tsx`
- Create: `apps/gen-alpha-lab/src/components/GenderLensPage.tsx`
- Modify: `apps/gen-alpha-lab/src/components/SiteHeader.tsx`
- Modify: `apps/gen-alpha-lab/src/components/MobileNav.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Create: `apps/gen-alpha-lab/tests/gender-page.test.tsx`
- Modify: `apps/gen-alpha-lab/tests/navigation.test.tsx`

**Interfaces:**
- Consumes: `genderLensTabs` and `getGenderFindings()` from Task 4.
- Produces: `/gender` with keyboard-accessible tabs and direct source links.

- [ ] **Step 1: Write failing route and navigation tests**

Assert a `Gender Lens` nav link, four accessible tabs, visible methodology/limitations, and a state change from All to Girls to Gender-diverse.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run tests/gender-page.test.tsx tests/navigation.test.tsx`

Expected: FAIL because the page and nav item do not exist.

- [ ] **Step 3: Implement the route, tab interaction, source rows, and caveat panel**

Use the Lab's existing editorial typography and evidence-ledger styling. Include the explanation that source definitions of gender vary and age is often a stronger modifier than a cohort label.

- [ ] **Step 4: Run the focused tests**

Run: `npm test -- --run tests/gender-page.test.tsx tests/navigation.test.tsx`

Expected: focused tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/gen-alpha-lab/src/app/gender apps/gen-alpha-lab/src/components apps/gen-alpha-lab/src/app/globals.css apps/gen-alpha-lab/tests
git commit -m "feat: add Gender Lens workspace"
```

### Task 6: Add the presentation-ready briefing and validity standard

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/content/briefing.ts`
- Create: `apps/gen-alpha-lab/src/lib/content/validity.ts`
- Create: `apps/gen-alpha-lab/src/app/briefing/page.tsx`
- Create: `apps/gen-alpha-lab/src/components/BriefingPage.tsx`
- Modify: `apps/gen-alpha-lab/src/components/SiteHeader.tsx`
- Modify: `apps/gen-alpha-lab/src/components/MobileNav.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Create: `apps/gen-alpha-lab/tests/briefing-page.test.tsx`
- Create: `apps/gen-alpha-lab/tests/validity.test.ts`

**Interfaces:**
- Produces: `briefingSections`, `assessSourceValidity(source)`, `/briefing`, and a `Briefing` nav item.
- Validity bands are `representative`, `rigorous-qualitative`, `directional`, and `agency-synthesis`.

- [ ] **Step 1: Write failing briefing and validity tests**

Assert six sections, slide-ready language, at least two exact insight links per section, House object labels, source-strength explanations, and deterministic validity assessment for representative research, qualitative research, industry/platform data, and owned synthesis.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run tests/briefing-page.test.tsx tests/validity.test.ts`

Expected: FAIL because the modules and route do not exist.

- [ ] **Step 3: Implement the typed briefing content and validity helper**

Keep all proof points traceable to existing insight and evidence IDs. Separate “what the evidence says,” “how to say it,” and “what not to overclaim.”

- [ ] **Step 4: Implement the presentation route and navigation**

Render a seven-minute talk path, six executive sections, insight links, caveats, and the four-level source standard without adding a slide-export dependency.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- --run tests/briefing-page.test.tsx tests/validity.test.ts tests/navigation.test.tsx`

Expected: all focused tests pass.

- [ ] **Step 6: Commit**

```bash
git add apps/gen-alpha-lab
git commit -m "feat: add presentation briefing and validity standard"
```

### Task 7: Full verification and deployment

**Files:**
- Modify: `README.md`
- Modify: `apps/gen-alpha-house/README.md`
- Modify: `apps/gen-alpha-lab/README.md`

**Interfaces:**
- Consumes: all previous tasks.
- Produces: verified production aliases for the hub, House, and Lab.

- [ ] **Step 1: Run all automated checks**

Run:

```bash
node --test tests/agencythings-hub.test.mjs
(cd apps/gen-alpha-house && npm test && npm run build)
(cd apps/gen-alpha-lab && npm test && npm run build)
git diff --check
```

Expected: zero failures and zero whitespace errors.

- [ ] **Step 2: Run Browser QA locally**

Verify desktop and 390px mobile: hub search and both Gen Alpha links; House arrival, object selection, multi-insight links, theme, Escape, and mobile index; Lab gender tabs, briefing sections, source links, and no console errors.

- [ ] **Step 3: Compare House concept and rendered implementation**

Inspect the generated bedroom asset and latest native-size browser screenshot with `view_image`. Check object visibility, hotspot alignment, drawer hierarchy, typography, palette, responsive crop, and copy.

- [ ] **Step 4: Deploy without replacing project identities**

Deploy the House to Vercel project `agencythings-gen-alpha-house`, the Lab to `agencythings-gen-alpha`, and the hub through the repository's existing GitHub Pages flow after pushing and merging the reviewed branch.

- [ ] **Step 5: Verify production**

Confirm both Vercel aliases return HTTP 200, the House artwork loads, the Lab gender and briefing routes render, the hub contains two separate Gen Alpha entries, and the object-to-insight deep-link path succeeds.

- [ ] **Step 6: Commit any final documentation corrections**

```bash
git add README.md apps/gen-alpha-house/README.md apps/gen-alpha-lab/README.md
git commit -m "docs: document Gen Alpha insight room surfaces"
```
