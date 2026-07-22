# Hydration Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate Hydration Refresh site that continuously gathers sourced cultural signals, persists editorial selections, and turns them into the monthly newsletter structure.

**Architecture:** A Next.js app under `apps/hydration-refresh` separates normalized source connectors, persistence repositories, editorial state, and React views. The app works immediately with seeded/live zero-key sources and versioned browser persistence, while optional Supabase and credentialed connectors fit behind the same interfaces.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Testing Library, CSS, RSS/JSON HTTP APIs, optional Supabase.

## Global Constraints

- This app is independent from Gen Alpha; only the Agency Things hub links to it.
- Preserve source URLs and provenance for every external item.
- Gatorade relevance is editorial metadata, never the sole ingestion filter.
- Manual refresh and scheduled refresh use the same source service.
- Missing Reddit/X credentials must be visible connector states, not fabricated substitutes.
- Saved stories, notes, storylines, and monthly drafts survive reloads.

---

### Task 1: App Foundation And Editorial Types

**Files:**
- Create: `apps/hydration-refresh/package.json`
- Create: `apps/hydration-refresh/src/lib/types.ts`
- Create: `apps/hydration-refresh/src/lib/seed-data.ts`
- Create: `apps/hydration-refresh/tests/content.test.ts`

**Interfaces:**
- Produces: `Story`, `ConnectorStatus`, `RefreshRun`, `SavedStory`, `Storyline`, `MonthlyIssue`, and validated seed content.

- [ ] Write tests that require unique story ids, valid source URLs, all source kinds, and all monthly sections.
- [ ] Add the minimal app/tooling configuration and editorial type definitions.
- [ ] Seed a culturally broad first feed using source-attributed examples and the July newsletter structure.
- [ ] Run `npm test -- content.test.ts` and confirm all content-contract tests pass.

### Task 2: Persistent Editorial Store

**Files:**
- Create: `apps/hydration-refresh/src/lib/persistence.ts`
- Create: `apps/hydration-refresh/src/lib/editorial-store.ts`
- Create: `apps/hydration-refresh/tests/editorial-store.test.ts`

**Interfaces:**
- Consumes: types from Task 1.
- Produces: `loadWorkspace()`, `saveWorkspace()`, `toggleSavedStory()`, `updateStoryNotes()`, `createStoryline()`, `assignStoryToStoryline()`, and `assignStoryToMonthlySection()`.

- [ ] Write tests for save/reload, note updates, storyline assignment, monthly assignment, and storage-version migration.
- [ ] Implement a versioned storage adapter with an in-memory test adapter and browser local-storage adapter.
- [ ] Implement immutable editorial actions and preserve saved state across feed replacement.
- [ ] Run `npm test -- editorial-store.test.ts` and confirm persistence tests pass.

### Task 3: Source Refresh Service

**Files:**
- Create: `apps/hydration-refresh/src/lib/connectors.ts`
- Create: `apps/hydration-refresh/src/lib/source-refresh.ts`
- Create: `apps/hydration-refresh/src/app/api/refresh/route.ts`
- Create: `apps/hydration-refresh/tests/source-refresh.test.ts`

**Interfaces:**
- Consumes: `Story` and `ConnectorStatus`.
- Produces: `refreshSources({ signal, now }): Promise<{ stories: Story[]; run: RefreshRun }>` and `POST /api/refresh`.

- [ ] Write tests for normalization, duplicate merging, partial connector failure, stale status, and response shape.
- [ ] Implement bounded RSS/news, Crossref, podcast-feed, and event connectors with timeout handling.
- [ ] Represent Reddit and X as credential-gated connectors and retain honest status messages when disabled.
- [ ] Implement the refresh API with cache-safe headers and partial-success responses.
- [ ] Run `npm test -- source-refresh.test.ts` and confirm connector tests pass.

### Task 4: Working Editorial Interface

**Files:**
- Create: `apps/hydration-refresh/src/components/HydrationRefreshApp.tsx`
- Create: `apps/hydration-refresh/src/components/StoryFeed.tsx`
- Create: `apps/hydration-refresh/src/components/SavedView.tsx`
- Create: `apps/hydration-refresh/src/components/StorylinesView.tsx`
- Create: `apps/hydration-refresh/src/components/MonthlyView.tsx`
- Create: `apps/hydration-refresh/src/app/page.tsx`
- Create: `apps/hydration-refresh/src/app/globals.css`
- Create: `apps/hydration-refresh/tests/workspace-ui.test.tsx`

**Interfaces:**
- Consumes: seed/live stories and editorial-store actions.
- Produces: Today, Saved, Storylines, and Monthly workflows matching the accepted concept.

- [ ] Write interaction tests for refresh, save, notes, filters, storyline creation/assignment, monthly assignment, and theme switching.
- [ ] Implement the app shell and the Today editorial list with connector status and selected-story expansion.
- [ ] Implement Saved and Storylines views with real persistent state.
- [ ] Implement the monthly issue builder using all six newsletter sections.
- [ ] Implement responsive CSS from the accepted concept and ensure controls use deliberate typography.
- [ ] Run `npm test -- workspace-ui.test.tsx` and confirm the core workflow passes.

### Task 5: Optional Cross-Device Persistence And Daily Trigger

**Files:**
- Create: `apps/hydration-refresh/src/lib/supabase-server.ts`
- Create: `apps/hydration-refresh/src/app/api/workspace/route.ts`
- Create: `apps/hydration-refresh/src/app/api/cron/daily/route.ts`
- Create: `apps/hydration-refresh/supabase/schema.sql`
- Create: `apps/hydration-refresh/vercel.json`
- Create: `apps/hydration-refresh/tests/api-routes.test.ts`

**Interfaces:**
- Produces: optional hosted workspace persistence and a scheduled endpoint that calls the same refresh service as Task 3.

- [ ] Write route tests for local fallback, configured persistence, cron authorization, and partial refresh results.
- [ ] Implement the Supabase repository without making it a requirement for local use.
- [ ] Implement a protected daily cron route and Vercel schedule.
- [ ] Run `npm test -- api-routes.test.ts` and confirm both configured and fallback modes pass.

### Task 6: Agency Things Hub Registration

**Files:**
- Modify: `assets/hub.js`
- Modify: `index.html`
- Modify: `tests/agencythings-hub.test.mjs`
- Modify: `README.md`

**Interfaces:**
- Consumes: final stable Vercel URL.
- Produces: searchable sixth project entry, project-row launch link, and desk-shelf link.

- [ ] Update hub tests to require six projects and the Hydration Refresh external link.
- [ ] Add the project registry item, project row, and shelf link with a distinct orange accent.
- [ ] Update repository/deployment documentation.
- [ ] Run `node --test tests/agencythings-hub.test.mjs` and confirm all hub tests pass.

### Task 7: Full Verification And Deployment

**Files:**
- Create: `apps/hydration-refresh/README.md`
- Modify: only files required by verification findings.

**Interfaces:**
- Produces: production-ready standalone app and verified hub integration.

- [ ] Run `npm test`, `npm run build`, and `git diff --check` for the new app.
- [ ] Start the app and verify refresh, save/reload, notes, storyline assignment, monthly assignment, source links, and theme switching in Browser/IAB.
- [ ] Verify 1440x1024 desktop and 390x844 mobile layouts, then compare the implementation screenshot with `docs/concepts/hydration-refresh-primary-screen.png` using `view_image`.
- [ ] Record and fix all fidelity-ledger mismatches, including copy, hierarchy, typography, palette, image treatment, spacing, controls, and responsive behavior.
- [ ] Deploy `apps/hydration-refresh` as its own Vercel project and update the hub URL if the final alias differs.
- [ ] Push the feature branch and report the verified public URLs.

