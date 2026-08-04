# Gen Alpha Demographic Overview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Intelligence Lab’s overloaded overview with a compact U.S.-first demographic primer, add a separate global snapshot, humanize generation comparisons, and rename Library to Sources without changing routes.

**Architecture:** Put sourced demographic constants and their metadata in one focused data module, render them through a dedicated overview component, and reduce `LabWorkspace` to the overview shell. Keep `/library` as the route while changing only user-facing labels. Extend the existing comparison model with humanized copy and a small internal-observation disclosure.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Testing Library, existing CSS token system, Lucide icons.

## Global Constraints

- The overview is demographic first; psychographics and marketing implications remain on deeper pages.
- U.S. population, sex, race, ethnicity, and geography use July 1, 2024 Census Population Estimates.
- Global population uses the World Bank 2024 ages 0–14 indicator derived from UN Population Division age distributions.
- Sexual and gender identity use CDC 2023 YRBS and are visibly labeled high-school-only.
- Race and Hispanic origin are not presented as mutually exclusive.
- Global race, ethnicity, sexual-orientation, and gender-identity rollups are not shown.
- `/library` and `/library/[sourceId]` URLs do not change.
- Existing light/dark themes, keyboard access, responsive navigation, and reduced-motion behavior remain intact.
- Do not stage or edit the existing untracked duplicate files ending in ` 2.ts`, ` 2.tsx`.

---

### Task 1: Add the sourced demographic model

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/demographics.ts`
- Create: `apps/gen-alpha-lab/tests/demographics.test.ts`

**Interfaces:**
- Produces: `demographicHeadlineFacts`, `usSexSplit`, `usRaceAlone`, `usEthnicityContext`, `usRegions`, `usTopStates`, `olderTeenIdentity`, `globalRegions`, `demographicSources`, and `deeperRoutes`.
- All percentage collections use `{ label: string; value: number; detail?: string }` and total 100 within rounding tolerance where their categories are exhaustive.

- [ ] **Step 1: Write the failing data tests**

Assert these exact values:

```ts
expect(demographicHeadlineFacts.map((fact) => fact.value)).toEqual([
  "2010–2024",
  "About 1–16",
  "59.7M",
  "2.01B",
]);
expect(usSexSplit).toEqual([
  { label: "Male", value: 51.1 },
  { label: "Female", value: 48.9 },
]);
expect(usRaceAlone.reduce((sum, item) => sum + item.value, 0)).toBeCloseTo(100, 1);
expect(usEthnicityContext).toContainEqual({ label: "Hispanic or Latino, any race", value: 27 });
expect(usRegions).toContainEqual({ label: "South", value: 40.2 });
expect(globalRegions).toContainEqual({ label: "Sub-Saharan Africa", value: 26.1 });
expect(olderTeenIdentity.scope).toMatch(/U.S. high-school students/i);
```

Also assert every public source URL begins with `https://`, and that the global coverage note explicitly rejects a combined global identity rollup.

- [ ] **Step 2: Run the data tests and verify RED**

Run: `npm test -- tests/demographics.test.ts`

Expected: FAIL because `src/lib/demographics.ts` does not exist.

- [ ] **Step 3: Implement the demographic constants**

Use these exact values:

```ts
export const usRaceAlone = [
  { label: "White alone", value: 69.4 },
  { label: "Black alone", value: 15.7 },
  { label: "Asian alone", value: 6.3 },
  { label: "Two or more races", value: 6.3 },
  { label: "American Indian and Alaska Native alone", value: 1.9 },
  { label: "Native Hawaiian and Other Pacific Islander alone", value: 0.4 },
];

export const usRegions = [
  { label: "South", value: 40.2 },
  { label: "West", value: 23.3 },
  { label: "Midwest", value: 20.8 },
  { label: "Northeast", value: 15.8 },
];

export const globalRegions = [
  { label: "Sub-Saharan Africa", value: 26.1 },
  { label: "East Asia & Pacific", value: 21.4 },
  { label: "South Asia", value: 20.8 },
  { label: "Middle East, North Africa, Afghanistan & Pakistan", value: 13.0 },
  { label: "Europe & Central Asia", value: 8.0 },
  { label: "Latin America & Caribbean", value: 7.4 },
  { label: "North America", value: 3.2 },
];
```

Source URLs:

```ts
const censusAgeSex = "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/national/asrh/nc-est2024-agesex-res.csv";
const censusRace = "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/national/asrh/nc-est2024-alldata-r-file10.csv";
const censusStates = "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/state/asrh/sc-est2024-agesex-civ.csv";
const worldPopulation = "https://data.worldbank.org/indicator/SP.POP.0014.TO?locations=1W";
const cdcIdentity = "https://www.cdc.gov/mmwr/volumes/73/su/su7304a1.htm";
const cdcGender = "https://www.cdc.gov/mmwr/volumes/73/su/su7304a6.htm";
```

- [ ] **Step 4: Run the data tests and verify GREEN**

Run: `npm test -- tests/demographics.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the demographic model**

```bash
git add apps/gen-alpha-lab/src/lib/demographics.ts apps/gen-alpha-lab/tests/demographics.test.ts
git commit -m "feat: add sourced Gen Alpha demographics"
```

### Task 2: Replace the overview with the compact demographic primer

**Files:**
- Create: `apps/gen-alpha-lab/src/components/DemographicOverview.tsx`
- Modify: `apps/gen-alpha-lab/src/components/LabWorkspace.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Modify: `apps/gen-alpha-lab/tests/lab-workspace.test.tsx`

**Interfaces:**
- Consumes: all exports from `@/lib/demographics`.
- Produces: the accessible regions `Who is Gen Alpha?`, `U.S. demographic portrait`, `Older edge identity data`, `Global snapshot`, and `Continue into the Lab`.

- [ ] **Step 1: Rewrite overview tests for the new contract**

The tests must assert:

```ts
expect(screen.getByRole("heading", { name: "Who is Gen Alpha?" })).toBeInTheDocument();
expect(screen.getAllByTestId("demographic-headline-fact")).toHaveLength(4);
expect(screen.getByText("59.7M")).toBeInTheDocument();
expect(screen.getByText("2.01B")).toBeInTheDocument();
expect(screen.getByRole("region", { name: "U.S. demographic portrait" })).toBeInTheDocument();
expect(screen.getByRole("region", { name: "Global snapshot" })).toBeInTheDocument();
expect(screen.getByText(/high-school students, not the full generation/i)).toBeInTheDocument();
expect(screen.getAllByTestId("deeper-route")).toHaveLength(4);
expect(screen.queryByText("Ten things to know before the deep dive.")).not.toBeInTheDocument();
expect(screen.queryByText(/Featured listening/i)).not.toBeInTheDocument();
expect(screen.queryByText(/Marketing 101: three established/i)).not.toBeInTheDocument();
expect(screen.queryByText("Curated media shelf")).not.toBeInTheDocument();
```

Add an interaction test that opens the older-teen `<details>` disclosure and reveals `73.3%` and `3.3%`.

- [ ] **Step 2: Run the overview tests and verify RED**

Run: `npm test -- tests/lab-workspace.test.tsx`

Expected: FAIL because the old long overview still renders.

- [ ] **Step 3: Build `DemographicOverview`**

Render:

- a birth-year rail with 2010, 2017, and 2024 labels;
- four immediate fact cards;
- an expanded U.S. section with reusable `ProportionBars`;
- a collapsed older-teen identity disclosure;
- a visually separate global section;
- four route cards linking to `/insights`, `/compare`, `/influencers`, and `/library`.

Every source link opens in a new tab with `rel="noreferrer"`. Every proportion bar exposes its value in text; color is never the only encoding.

- [ ] **Step 4: Reduce `LabWorkspace` to the shell**

Keep the existing prop signature so the route does not change:

```tsx
export default function LabWorkspace({ initialRecords: _initialRecords }: LabWorkspaceProps) {
  return (
    <main className="overview-page demographic-overview-page">
      <SiteHeader active="overview" />
      <DemographicOverview />
    </main>
  );
}
```

Delete the homepage-only imports and constants that are no longer rendered.

- [ ] **Step 5: Add responsive demographic styles**

Add a compact data system using existing theme tokens:

- `.demographic-opening`
- `.demographic-age-rail`
- `.demographic-headline-grid`
- `.demographic-section`
- `.demographic-bars`
- `.demographic-disclosure`
- `.global-demographic-section`
- `.demographic-next-grid`

At `max-width: 700px`, use one column, move labels above bars, and ensure `overflow-x` remains absent.

- [ ] **Step 6: Run overview tests and verify GREEN**

Run: `npm test -- tests/lab-workspace.test.tsx tests/demographics.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit the overview**

```bash
git add apps/gen-alpha-lab/src/components/DemographicOverview.tsx apps/gen-alpha-lab/src/components/LabWorkspace.tsx apps/gen-alpha-lab/src/app/globals.css apps/gen-alpha-lab/tests/lab-workspace.test.tsx
git commit -m "feat: make the Lab overview demographic first"
```

### Task 3: Rename visible Library language to Sources

**Files:**
- Modify: `apps/gen-alpha-lab/src/components/SiteHeader.tsx`
- Modify: `apps/gen-alpha-lab/src/components/ComparePage.tsx`
- Modify: `apps/gen-alpha-lab/src/components/LibraryPage.tsx`
- Modify: `apps/gen-alpha-lab/tests/navigation.test.tsx`
- Modify: `apps/gen-alpha-lab/tests/compare-page.test.tsx`
- Modify: `apps/gen-alpha-lab/tests/library-page.test.tsx`
- Modify: `apps/gen-alpha-lab/tests/detail-pages.test.tsx`

**Interfaces:**
- Preserves: every `/library` URL.
- Changes: visible destination label to `Sources`, `Open library record` to `Open source record`, and filter ARIA labels to `Filter sources by …`.

- [ ] **Step 1: Change tests to expect Sources language**

Update navigation expectation to:

```ts
["Sources", "/library"]
```

Update comparison link names to `/Open source record/i`, and source-page filter labels to `Filter sources by market` and `Filter sources by format`.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- tests/navigation.test.tsx tests/compare-page.test.tsx tests/library-page.test.tsx tests/detail-pages.test.tsx`

Expected: FAIL on old Library labels.

- [ ] **Step 3: Update visible copy without renaming internal symbols**

Keep component names, CSS classes, test filenames, and route paths containing `library`; update only text, `aria-label`, headings, and link labels visible to people.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the same focused command.

Expected: PASS.

- [ ] **Step 5: Commit Sources language**

```bash
git add apps/gen-alpha-lab/src/components/SiteHeader.tsx apps/gen-alpha-lab/src/components/ComparePage.tsx apps/gen-alpha-lab/src/components/LibraryPage.tsx apps/gen-alpha-lab/tests/navigation.test.tsx apps/gen-alpha-lab/tests/compare-page.test.tsx apps/gen-alpha-lab/tests/library-page.test.tsx apps/gen-alpha-lab/tests/detail-pages.test.tsx
git commit -m "refactor: rename Library to Sources"
```

### Task 4: Humanize the comparison experience

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/comparison-observations.ts`
- Modify: `apps/gen-alpha-lab/src/lib/content/comparisons.ts`
- Modify: `apps/gen-alpha-lab/src/components/ComparePage.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Modify: `apps/gen-alpha-lab/tests/compare-page.test.tsx`

**Interfaces:**
- Produces: `comparisonObservations: { title: string; summary: string; status: "internal observation"; href: string }[]`.
- Preserves: comparison evidence IDs, comparison classes, source links, cohort controls, and caveats.

- [ ] **Step 1: Add failing human-language assertions**

Assert that the default Media & attention result includes:

```ts
expect(within(result).getByText(/media isn't a lineup; it's a living room/i)).toBeInTheDocument();
expect(within(result).getByText(/Treat Gen Z as the rough draft, not the final answer/i)).toBeInTheDocument();
expect(within(result).getByText(/spots the creator inside the game itself/i)).toBeInTheDocument();
```

Switch to Play & belonging and Learning & AI and assert the humanized mentality, interpretation, and real-life example. Add a disclosure test for four `Internal observation` cards; the disclosure begins closed.

- [ ] **Step 2: Run comparison tests and verify RED**

Run: `npm test -- tests/compare-page.test.tsx`

Expected: FAIL because the Zackary Plutzer phrasing and observation disclosure are absent.

- [ ] **Step 3: Update the first three Gen Alpha versus Gen Z comparisons**

Use the confidential PDF as a writing reference, not as a public source. Preserve evidence and caveats while updating the three mentality strings, strategic interpretations, and everyday examples.

- [ ] **Step 4: Add four linked internal observations**

Create:

```ts
export const comparisonObservations = [
  { title: "Physical discovery still matters", summary: "Digital fluency can coexist with a desire to make, collect, visit, and experience something in person.", status: "internal observation", href: "/insights/time-coexistence" },
  { title: "Co-creation may be the default ask", summary: "Participation can move beyond choosing into shaping formats, products, and places.", status: "internal observation", href: "/insights/learning-remix" },
  { title: "Human-feeling platforms deserve a closer look", summary: "Search, saving, and intentional browsing may feel different from a feed that never ends.", status: "internal observation", href: "/spaces#pinterest" },
  { title: "Calm can be a form of relevance", summary: "Comfort, ritual, and the pleasure of staying in the present may matter as much as novelty.", status: "internal observation", href: "/summary#research-frontier" },
] as const;
```

Render them below the comparison result in a collapsed `<details>` labeled `Human observations to investigate`.

- [ ] **Step 5: Run comparison tests and verify GREEN**

Run: `npm test -- tests/compare-page.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit comparison changes**

```bash
git add apps/gen-alpha-lab/src/lib/comparison-observations.ts apps/gen-alpha-lab/src/lib/content/comparisons.ts apps/gen-alpha-lab/src/components/ComparePage.tsx apps/gen-alpha-lab/src/app/globals.css apps/gen-alpha-lab/tests/compare-page.test.tsx
git commit -m "feat: humanize generation comparisons"
```

### Task 5: Verify, publish, and validate production

**Files:**
- Verify all changed files.
- Do not include `tmp/` or the untracked duplicate ` 2` files in commits.

**Interfaces:**
- Produces: a pushed branch, updated existing PR, and verified production alias.

- [ ] **Step 1: Run the complete Lab test suite**

Run: `npm test`

Expected: all test files pass with zero failed tests.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: exit 0 and all static pages generated.

- [ ] **Step 3: Run repository hygiene checks**

Run from the worktree root:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only intentional tracked changes plus the pre-existing duplicate files and temporary PDF render directory.

- [ ] **Step 4: Run browser QA locally**

Check these flows at 1440×900 and 390×844:

- `/` → read four headline facts → open older-teen identity disclosure → follow a source.
- `/compare` → switch topic → open Human observations → follow a linked research destination.
- `/library` → confirm Sources navigation and source filters.

Verify no runtime error overlay, console errors, or horizontal page overflow.

- [ ] **Step 5: Push the branch**

```bash
git push origin codex/gen-alpha-gender-rooms
```

- [ ] **Step 6: Deploy the Lab from the repository root**

```bash
npx --yes vercel@latest deploy --prod --yes --project agencythings-gen-alpha --logs
```

Expected: deployment reaches READY and aliases to `https://agencythings-gen-alpha.vercel.app`.

- [ ] **Step 7: Verify the stable alias**

Confirm HTTP 200 for `/`, `/compare`, and `/library`, then verify live content markers `Who is Gen Alpha?`, `59.7M`, `Human observations to investigate`, and `Sources`.

