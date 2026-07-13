# Problem Wall Weekly Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dense client-handoff dashboard with a fresh weekly problem-discovery, B.U.R.S.T.-scoring, shortlist, and wrap-up workflow.

**Architecture:** A source-refresh layer gathers and normalizes live news, research, and community records without mixing fallback examples into current results. Generic problem candidates are generated from normalized signals and scored by a stricter evidence-aware B.U.R.S.T. engine. React owns review/shortlist state and uses Supabase-ready persistence with local fallback.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, RSS/JSON/OpenAlex fetchers, Vercel Cron, Supabase-ready persistence.

## Global Constraints

- New this week never contains deck inspiration or silent fallback records.
- Every new candidate has a direct source URL and publication date.
- No strategist, email, client-fit, approval, or deck-export UI in the primary workflow.
- B.U.R.S.T. dimensions remain bigger reason, unexpectedness, relevancy, specificity, and targeted cause.
- Missing evidence caps a candidate below `wall ready`.
- Monday cron and manual Find New Problems use the same refresh function.

---

### Task 1: Live Source Pipeline

**Files:**
- Modify: `apps/problem-wall-lab/src/lib/types.ts`
- Replace: `apps/problem-wall-lab/src/lib/source-refresh.ts`
- Modify: `apps/problem-wall-lab/tests/workflow.test.ts`
- Create: `apps/problem-wall-lab/tests/source-refresh.test.ts`

**Interfaces:**
- Produces: `RefreshResult { signals, sourcesAttempted, sourcesSucceeded, failures, refreshedAt }`; `refreshSourceSignals(options)` with injectable fetcher and clock.

- [ ] **Step 1: Write failing source tests**

Use fixture responses to assert Google News RSS, OpenAlex JSON, and Reddit JSON normalize into direct-linked signals; duplicates collapse by canonical URL/title; stale and URL-less records are rejected; complete source failure returns an empty `signals` array plus failure metadata, never seeds.

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm test -- --run`

Expected: failure because current refresh returns a signal array mixed with fallbacks.

- [ ] **Step 3: Implement normalized refresh**

Create query groups across work, learning, health, technology, family, media, money, accessibility, climate, and community. Parse RSS and JSON responses, canonicalize URLs, tag source class, enforce a 21-day freshness window, and return explicit per-source failures.

- [ ] **Step 4: Verify GREEN**

Run: `corepack pnpm test -- --run`

Expected: source fixture and existing workflow tests pass.

### Task 2: Generic Candidate Generation And B.U.R.S.T. Scoring

**Files:**
- Replace: `apps/problem-wall-lab/src/lib/problem-wall.ts`
- Modify: `apps/problem-wall-lab/src/lib/types.ts`
- Modify: `apps/problem-wall-lab/tests/problem-wall.test.ts`

**Interfaces:**
- Produces: `buildProblemFromSignal(signal, weekOf)`, `generateWeeklyWall({ weekOf, signals, limit })`, and stricter `scoreProblemCandidate(candidate)`.

- [ ] **Step 1: Write failing candidate tests**

Assert candidates contain no client/strategist fields, preserve source URL/date, produce a problem/bigger reason/root cause, and receive a five-dimension score. Assert no-source candidate cannot grade `wall ready`; fresh specific evidence scores higher than stale vague evidence.

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm test -- --run`

Expected: failure because current generation requires client briefs and emits strategist/client content.

- [ ] **Step 3: Implement generic framing and scoring**

Build one candidate per source signal using audience, behavior, tension, consequence, why-it-matters, and root cause. Score each dimension from explicit evidence and return dimension-level reasons. Remove client-fit bonuses and fixed `2026-07-09` recency clock; accept `now` as an argument.

- [ ] **Step 4: Verify GREEN**

Run: `corepack pnpm test -- --run`

Expected: all candidate and scoring tests pass.

### Task 3: Weekly Review, Shortlist, And Wrap Up UI

**Files:**
- Replace: `apps/problem-wall-lab/src/components/ProblemWallWorkspace.tsx`
- Modify: `apps/problem-wall-lab/src/app/globals.css`
- Modify: `apps/problem-wall-lab/src/app/api/weekly-refresh/route.ts`
- Modify: `apps/problem-wall-lab/tests/workspace-ui.test.tsx`

**Interfaces:**
- Consumes: `RefreshResult`, generated candidates, and deck inspiration stored separately.
- Produces: This Week, Shortlist, Reviewed, Deck Inspiration, and Wrap Up views.

- [ ] **Step 1: Write failing interface tests**

Assert `Find new problems`, `New this week`, `Shortlist`, `Reviewed`, `Deck inspiration`, and `Wrap up` appear. Assert strategist, email, client fit, Approve, Reject, and Export deck are absent.

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm test -- --run`

Expected: failure against the current command-center UI.

- [ ] **Step 3: Implement the sequential UI**

Use one reading column and weekly summary rail. Fetch the manual refresh route, show loading/success/partial-failure/empty states, render candidates with score disclosure and direct sources, and support shortlist/pass actions. Keep deck examples in a separate inspiration dataset and view.

- [ ] **Step 4: Implement wrap-up state**

Persist candidate status and notes locally. Wrap Up ranks shortlist by score and provides copy-summary and JSON download actions. No deck or strategist formatting is emitted.

- [ ] **Step 5: Verify GREEN**

Run: `corepack pnpm test -- --run`

Expected: all UI, source, and scoring tests pass.

### Task 4: Cron, Persistence, And Production Verification

**Files:**
- Modify: `apps/problem-wall-lab/src/app/api/weekly-refresh/route.ts`
- Modify: `apps/problem-wall-lab/vercel.json`
- Modify: `apps/problem-wall-lab/supabase/schema.sql`
- Modify: `apps/problem-wall-lab/README.md`

- [ ] **Step 1: Add route tests for shared logic and auth**

Assert manual and cron callers use the same refresh/generation functions. Assert configured `CRON_SECRET` rejects a mismatched Authorization header and allows `Bearer <secret>`.

- [ ] **Step 2: Implement persistence contract**

Store weekly run metadata, normalized sources, candidates, shortlist status, and notes in Supabase when configured. Return `mode: "supabase" | "demo"` and explicit persistence errors. Keep Monday schedule `0 13 * * 1`.

- [ ] **Step 3: Verify all tests and production build**

Run: `corepack pnpm test -- --run`

Run: `corepack pnpm build`

Expected: all tests and Next build pass.

- [ ] **Step 4: Browser and live QA**

Verify Find New Problems, partial failure, empty state, score details, shortlist, pass, notes, wrap-up copy/JSON, deck inspiration isolation, console health, and 390px layout. Deploy through `agencythings-problem-wall` and verify the stable URL.
