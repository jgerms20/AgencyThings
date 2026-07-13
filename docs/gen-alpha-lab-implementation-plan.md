# Gen Alpha Intelligence Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate Vercel-ready Gen Alpha research lab app inside the AgencyThings repository.

**Architecture:** A Next app in `apps/gen-alpha-lab` owns the Gen Alpha experience. Static seed data powers the public insight surface, client-side state powers immediate demos, and API routes become persistent when Supabase credentials are present.

**Tech Stack:** Next 16, React 19, TypeScript, Vitest, lucide-react, Supabase JS.

## Global Constraints

- Keep the existing root `index.html` and `tools/digital-task-brief-maker/` behavior unchanged.
- Vercel project root is `apps/gen-alpha-lab`.
- Persistence must be Supabase-ready and must degrade into a usable local demo when env vars are absent.
- No private interview content is committed beyond sample records.

---

### Task 1: Core Research Record Logic

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/types.ts`
- Create: `apps/gen-alpha-lab/src/lib/research-records.ts`
- Test: `apps/gen-alpha-lab/tests/research-records.test.ts`

**Interfaces:**
- Produces: `ResearchRecord`, `FilterState`, `normalizeTags`, `filterRecords`, `buildRecordFromUpload`, `summarizeLibrary`.

- [ ] Write failing tests for tag normalization, record filtering, upload record creation, and library summaries.
- [ ] Implement the minimal helpers.
- [ ] Run `npm test`.

### Task 2: Next App Shell

**Files:**
- Create: `apps/gen-alpha-lab/src/app/layout.tsx`
- Create: `apps/gen-alpha-lab/src/app/page.tsx`
- Create: `apps/gen-alpha-lab/src/app/globals.css`
- Create: `apps/gen-alpha-lab/src/components/LabWorkspace.tsx`
- Create: `apps/gen-alpha-lab/src/lib/seed-data.ts`

**Interfaces:**
- Consumes: research record helpers.
- Produces: public insight surface and interactive lab workspace.

- [ ] Build the first viewport, signal map, evidence library, interview archive, and source upload form.
- [ ] Add responsive styling and accessible controls.
- [ ] Run `npm run build`.

### Task 3: Persistence Layer

**Files:**
- Create: `apps/gen-alpha-lab/src/lib/supabase-server.ts`
- Create: `apps/gen-alpha-lab/src/app/api/lab-records/route.ts`
- Create: `apps/gen-alpha-lab/src/app/api/uploads/route.ts`
- Create: `apps/gen-alpha-lab/supabase/schema.sql`
- Create: `apps/gen-alpha-lab/.env.example`

**Interfaces:**
- Produces: GET/POST APIs for records and multipart upload handling.

- [ ] Add Supabase server client detection.
- [ ] Add API fallback responses for unconfigured demo mode.
- [ ] Document required env vars and schema.
- [ ] Run `npm test` and `npm run build`.

### Task 4: Deployment Docs and Repo Wiring

**Files:**
- Modify: `README.md`
- Create: `apps/gen-alpha-lab/README.md`

**Interfaces:**
- Produces: instructions for local run, Vercel root directory, and Supabase setup.

- [ ] Document the separate Vercel deployment.
- [ ] Confirm existing GitHub Pages root remains unchanged.
- [ ] Run final tests and browser QA.
