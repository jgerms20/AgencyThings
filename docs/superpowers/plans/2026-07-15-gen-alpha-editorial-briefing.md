# Gen Alpha Editorial Briefing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dense Gen Alpha field-guide homepage with a concise four-insight editorial briefing, a real creator influence page, a dedicated research library, and leaner insight-led detail routes.

**Architecture:** Keep the existing findings, topics, research records, and API routes as the evidence layer. Add focused data and components for consolidated insights and creators, move library state into its own route, and share a compact global header across all editorial pages. CSS is rewritten around full-width bands and open layouts instead of repeated card grids.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Testing Library, Lucide React, existing Vercel deployment.

## Global Constraints

- Homepage visible copy is reduced by roughly 80 percent.
- Persistent navigation contains only Overview, People, Library, and theme control.
- Every route starts with a bold insight and puts evidence one layer deeper.
- Homepage uses four consolidated truths and never renders the full library.
- `/people` includes MrBeast, IShowSpeed, Kai Cenat, Aphmau, Salish Matter, and Ms. Rachel with at least three women.
- `/library` preserves exact Make, Think, Learn record filtering and format grouping.
- Existing finding and topic URLs remain valid.
- No gradients, horizontal scrollers, decorative blobs, nested cards, or dashboard panels.
- Dark mode remains the default and 390px layouts have no horizontal overflow.

---

### Task 1: Editorial Data And Shared Header

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/editorial.ts`
- Create: `apps/gen-alpha-lab/src/components/SiteHeader.tsx`
- Create: `apps/gen-alpha-lab/tests/editorial.test.ts`

**Interfaces:**
- Produces: `editorialInsights`, `creators`, `libraryTakeaways`, `EditorialInsight`, `CreatorProfile`, and `SiteHeader`.
- Consumes: stable finding and topic route strings already present in `src/lib/findings.ts`.

- [ ] **Step 1: Write failing editorial data tests**

Assert exactly four insight IDs and six creator names, that creator records include at least three women, portrait paths, official URLs, and copy under the agreed limits.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run tests/editorial.test.ts`

Expected: FAIL because `src/lib/editorial.ts` does not exist.

- [ ] **Step 3: Implement typed editorial data and shared navigation**

Define:

```ts
export type EditorialInsight = {
  id: "ai" | "play" | "video" | "influence";
  label: string;
  title: string;
  interpretation: string;
  href: string;
  tone: "acid" | "cyan" | "coral" | "violet";
};

export type CreatorProfile = {
  id: string;
  name: string;
  pronouns: "he" | "she";
  role: string;
  insight: string;
  portrait: string;
  portraitAlt: string;
  profileUrl: string;
  sourceUrl: string;
};
```

Render `SiteHeader` with exact links `/`, `/people`, `/library`, and `ThemeToggle`.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- --run tests/editorial.test.ts`

Expected: PASS.

### Task 2: Overview, People, And Library Routes

**Files:**
- Replace: `apps/gen-alpha-lab/src/components/LabWorkspace.tsx`
- Create: `apps/gen-alpha-lab/src/components/PeoplePage.tsx`
- Create: `apps/gen-alpha-lab/src/components/LibraryPage.tsx`
- Create: `apps/gen-alpha-lab/src/app/people/page.tsx`
- Create: `apps/gen-alpha-lab/src/app/library/page.tsx`
- Modify: `apps/gen-alpha-lab/src/app/page.tsx`
- Replace: `apps/gen-alpha-lab/tests/lab-workspace.test.tsx`
- Create: `apps/gen-alpha-lab/tests/people-page.test.tsx`
- Create: `apps/gen-alpha-lab/tests/library-page.test.tsx`

**Interfaces:**
- Consumes: `editorialInsights`, `creators`, `libraryTakeaways`, `findings`, `seedRecords`, `filterLibraryRecords`, and `getLibrarySections`.
- Produces: short Overview, full People page, and dedicated filtered Library page.

- [ ] **Step 1: Write failing route-surface tests**

Overview assertions:

```tsx
expect(screen.getByRole("heading", { name: "Gen Alpha, in four truths." })).toBeInTheDocument();
expect(screen.getAllByTestId("editorial-insight")).toHaveLength(4);
expect(screen.queryByText("How their world fits together")).not.toBeInTheDocument();
expect(screen.queryByRole("heading", { name: "Articles" })).not.toBeInTheDocument();
```

People assertions cover six names and at least three portrait alts. Library assertions cover source groups and click behavior for Make, Think, and Learn.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run tests/lab-workspace.test.tsx tests/people-page.test.tsx tests/library-page.test.tsx`

Expected: FAIL against the old homepage and missing routes/components.

- [ ] **Step 3: Implement the three primary surfaces**

Overview renders compact opening, four full-width insight bands, six-person preview, compact podcast recommendation, and library invitation. People uses alternating profile bands and a final implication strip. Library owns filter state and regroups filtered records by format.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- --run tests/lab-workspace.test.tsx tests/people-page.test.tsx tests/library-page.test.tsx`

Expected: PASS.

### Task 3: Insight-Led Detail Routes And Styling

**Files:**
- Modify: `apps/gen-alpha-lab/src/components/FindingDetail.tsx`
- Modify: `apps/gen-alpha-lab/src/components/TopicDetail.tsx`
- Replace: `apps/gen-alpha-lab/src/app/globals.css`
- Create: `apps/gen-alpha-lab/tests/detail-pages.test.tsx`
- Add: `apps/gen-alpha-lab/public/creators/*`

**Interfaces:**
- Consumes: existing `Finding`, `TopicLens`, support-record helpers, and new `SiteHeader`.
- Produces: distinct `What we know`, `Why it matters`, and `Evidence` sections with no duplicated route chrome.

- [ ] **Step 1: Write failing detail hierarchy tests**

Render one finding and one topic. Assert both use the shared navigation, lead with their insight headline, expose evidence links, and omit `Visual anatomy`, confidence labels, and repeated route-navigation grids.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run tests/detail-pages.test.tsx`

Expected: FAIL against current detail markup.

- [ ] **Step 3: Implement lean detail pages and the editorial CSS system**

Use solid color bands, bounded typography, open lists, consistent portrait ratios, and mobile layout rules. Keep every existing source URL and dynamic route intact.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- --run tests/detail-pages.test.tsx`

Expected: PASS.

### Task 4: Full Verification And Deployment

**Files:**
- Verify: `apps/gen-alpha-lab/**`
- Create: `docs/superpowers/qa/2026-07-15-gen-alpha-editorial-qa.md`

**Interfaces:**
- Consumes: completed redesign.
- Produces: test, build, browser, responsive, and visual evidence.

- [ ] **Step 1: Run full automated verification**

Run: `npm test && npm run build && git diff --check`

Expected: all tests pass, Next build exits 0, and no whitespace errors.

- [ ] **Step 2: Run browser QA**

Check Overview, People, Library filter state, one finding, one topic, light mode, external links, console errors, and horizontal overflow at desktop and 390px.

- [ ] **Step 3: Inspect screenshots**

Use `view_image` on the user screenshot, concept, and final desktop/mobile renders. Record hierarchy, copy density, contrast, portrait framing, navigation, and responsive findings in the QA file.

- [ ] **Step 4: Commit, push, merge, and verify production**

Publish through a pull request, wait for Vercel checks, merge into `main`, and confirm the stable Gen Alpha URL renders the four truths and working Library route.

