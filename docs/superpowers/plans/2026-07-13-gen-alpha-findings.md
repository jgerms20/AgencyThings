# Gen Alpha Findings Field Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Gen Alpha Intelligence Lab into a findings-first cultural field guide with transparent supporting evidence, owned media, and interview upload.

**Architecture:** Typed finding and topic-lens data sit beside the existing research records. The React page renders editorial sections from those relationships while retaining the existing record utilities and API routes. Interview upload remains the only prominent intake path; source records are navigated through finding footnotes and a sourcebook.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Supabase-ready APIs, localStorage fallback.

## Global Constraints

- No age-band navigation.
- Primary areas are Connect, Media, Influence, Time, Learn, Play & Create, and AI.
- Every published finding has at least two supporting records and at least one non-community source.
- No visible `Add source`, research queue, or demo-mode chip in the primary experience.
- `Upload interview` remains prominent and persists records.
- Spotify episode ID is `7l1peATWasIYA07RvqKgwn` and status is `To listen / synthesize`.

---

### Task 1: Findings And Source Relationships

**Files:**
- Modify: `apps/gen-alpha-lab/src/lib/types.ts`
- Modify: `apps/gen-alpha-lab/src/lib/seed-data.ts`
- Create: `apps/gen-alpha-lab/src/lib/findings.ts`
- Create: `apps/gen-alpha-lab/tests/findings.test.ts`

**Interfaces:**
- Produces: `Finding`, `TopicLens`, `findingTopics`, `findings`, `getSupportingRecords(finding, records)`, and `validateFindings(findings, records)`.

- [ ] **Step 1: Write failing validation tests**

Assert all seven topic IDs exist; every finding has two valid source IDs; every finding has a source whose kind is report/article/podcast with confidence medium/high; and the owned Spotify episode record is present with the exact URL and status note.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --reporter=dot`

Expected: failure because finding types and validators do not exist.

- [ ] **Step 3: Implement finding data**

Add stable findings covering connection, media, influence, time, learning, play/creation, and AI. Reuse the strongest existing reports and add current primary/peer-reviewed sources. Add the Eclectic Polymath episode as an owned podcast record with tags `owned`, `ai`, `gaming`, `digital-childhood` and summary noting synthesis is pending.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- --reporter=dot`

Expected: finding validation and existing research-record tests pass.

### Task 2: Editorial Field Guide Surface

**Files:**
- Replace: `apps/gen-alpha-lab/src/components/LabWorkspace.tsx`
- Modify: `apps/gen-alpha-lab/src/app/globals.css`
- Modify: `apps/gen-alpha-lab/src/app/page.tsx`
- Modify: `apps/gen-alpha-lab/tests/lab-workspace.test.tsx`

**Interfaces:**
- Consumes: findings, topic lenses, research records, existing upload builder, and API routes.
- Produces: overview, topic navigation, finding stories, source footnotes, featured owned media, sourcebook, and interview archive.

- [ ] **Step 1: Write failing interface tests**

Render the page and assert all topic labels, featured findings, `How their world fits together`, the podcast title, `Upload interview`, and Sourcebook are visible. Assert `Add source`, `Research queue`, and `Demo mode` are absent.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --reporter=dot`

Expected: failure against the current dashboard labels.

- [ ] **Step 3: Implement the editorial surface**

Compose a calm header, first-viewport framing, three featured findings, an editorial world map, seven topic bands, finding articles with source links, owned podcast feature, sourcebook grouped by source class, interview archive, and upload drawer. Keep interface text code-native and use existing Lucide icons.

- [ ] **Step 4: Preserve interview submission**

Adapt the current submit flow so the form only creates interview records. Keep file reading, localStorage fallback, `/api/uploads`, and `/api/lab-records`. Use safe storage parsing and show a concise saved state.

- [ ] **Step 5: Verify GREEN**

Run: `npm test -- --reporter=dot`

Expected: all finding, interface, upload, and record tests pass.

### Task 3: Research Expansion

**Files:**
- Modify: `apps/gen-alpha-lab/src/lib/seed-data.ts`
- Modify: `apps/gen-alpha-lab/tests/findings.test.ts`

**Interfaces:**
- Produces: source records classified as `primary research`, `peer reviewed`, `journalism`, `video`, `community`, or `owned`.

- [ ] **Step 1: Add failing source-class tests**

Assert sourcebook contains at least three primary-research records, three peer-reviewed records, one journalism record, one video record, one community record, and the owned podcast.

- [ ] **Step 2: Verify RED**

Run: `npm test -- --reporter=dot`

Expected: failure because source classes and new research records are incomplete.

- [ ] **Step 3: Add researched records**

Add records from primary reports and peer-reviewed studies discovered during live research. Preserve direct URLs, dates, source class, concise relevance notes, and topic tags. Add New York Times and YouTube entries only when a stable direct URL and clear relevance are available; otherwise omit rather than invent.

- [ ] **Step 4: Verify GREEN and build**

Run: `npm test -- --reporter=dot`

Run: `npm run build`

Expected: all tests and Next production build pass.

### Task 4: Browser And Production Verification

**Files:**
- Verify: Gen Alpha app files

- [ ] **Step 1: Browser QA locally**

Verify overview, each topic link, finding support links, Spotify launch, sourcebook filtering/grouping, interview upload, and saved interview state at desktop and 390px.

- [ ] **Step 2: Visual fidelity QA**

Compare the accepted Gen Alpha concept and implementation screenshot using `view_image`; fix hierarchy, type, imagery, spacing, and mobile issues.

- [ ] **Step 3: Deploy and verify production**

Deploy through the connected `agencythings-gen-alpha` Vercel project and verify title, first finding, Spotify episode, topic navigation, and upload interaction on the stable URL.

