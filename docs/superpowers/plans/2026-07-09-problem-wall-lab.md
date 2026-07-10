# Problem Wall Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vercel-ready internal web app that refreshes, scores, reviews, and exports weekly Problem Wall candidates for agency strategy teams.

**Architecture:** A standalone Next app lives in `apps/problem-wall-lab` so it can deploy as its own Vercel project root without changing the existing GitHub Pages tool. Pure TypeScript modules handle B.U.R.S.T. scoring, weekly candidate generation, source refresh fallbacks, and workflow export; the React UI provides the review wall, inspector, source intake, client filters, and export-ready card data.

**Tech Stack:** Next 16, React 19, TypeScript, Vitest, lucide-react, optional Supabase-ready schema, Vercel cron config.

## Global Constraints

- Keep the existing root site and `tools/digital-task-brief-maker/` unchanged.
- Keep the app isolated under `apps/problem-wall-lab/`.
- Use the deck's card anatomy: `DETAILS`, `STRATEGIST TO REACH OUT TO`, `PROBLEM`, and `OPPORTUNITY`.
- Use the deck's quality rubric: Bigger reason to care, Unexpectedness, Relevancy/Urgency, Specificity, and Targeted Solvable Cause.
- Ship a usable demo mode even before external source credentials or Supabase are configured.
- Make the UI a working internal tool, not a landing page.

---

### Task 1: Problem Wall Core Logic

**Files:**
- Create: `apps/problem-wall-lab/src/lib/types.ts`
- Create: `apps/problem-wall-lab/src/lib/seed-data.ts`
- Create: `apps/problem-wall-lab/src/lib/problem-wall.ts`
- Test: `apps/problem-wall-lab/tests/problem-wall.test.ts`

**Interfaces:**
- Produces: `scoreProblemCandidate`, `buildProblemFromSignal`, `generateWeeklyWall`, `formatProblemSlideText`.

- [ ] Write failing tests for scoring, candidate generation, weekly sorting, and deck-text formatting.
- [ ] Implement the minimal core logic.
- [ ] Run `npm test`.

### Task 2: Weekly Workflow and Source Refresh

**Files:**
- Create: `apps/problem-wall-lab/src/lib/workflow.ts`
- Create: `apps/problem-wall-lab/src/lib/source-refresh.ts`
- Create: `apps/problem-wall-lab/src/app/api/weekly-refresh/route.ts`
- Create: `apps/problem-wall-lab/src/app/api/source-signals/route.ts`
- Create: `apps/problem-wall-lab/vercel.json`
- Test: `apps/problem-wall-lab/tests/workflow.test.ts`

**Interfaces:**
- Produces: `buildWeeklyWorkflow`, `refreshSourceSignals`, weekly cron API response.

- [ ] Write failing tests for workflow steps, cron schedule, and resilient source fallback.
- [ ] Implement workflow generation and API routes.
- [ ] Run `npm test`.

### Task 3: Internal Web App UI

**Files:**
- Create: `apps/problem-wall-lab/src/app/layout.tsx`
- Create: `apps/problem-wall-lab/src/app/page.tsx`
- Create: `apps/problem-wall-lab/src/app/globals.css`
- Create: `apps/problem-wall-lab/src/components/ProblemWallWorkspace.tsx`

**Interfaces:**
- Consumes: core weekly wall generation, seed client roster, workflow export.
- Produces: a responsive internal UI with source intake, client filter, generated pool, approval states, inspector, and exportable deck copy.

- [ ] Build the first viewport around the working wall, not a marketing hero.
- [ ] Add local state for refresh, generate, approve, reject, and export flows.
- [ ] Verify desktop and mobile layout.

### Task 4: Deployment Readiness

**Files:**
- Create: `apps/problem-wall-lab/README.md`
- Create: `apps/problem-wall-lab/.env.example`
- Create: `apps/problem-wall-lab/supabase/schema.sql`
- Modify: `README.md`

**Interfaces:**
- Produces: Vercel root-directory setup instructions, weekly cron notes, optional Supabase schema, and local run commands.

- [ ] Document Vercel project root as `apps/problem-wall-lab`.
- [ ] Document optional source and Supabase environment variables.
- [ ] Run tests, build, and local browser QA.
