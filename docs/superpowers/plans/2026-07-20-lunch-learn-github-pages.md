# Lunch & Learn GitHub Pages Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the already-approved Lunch & Learn Partner Desk, publish it inside the existing AgencyThings GitHub Pages site, and keep the current desktop and Digital Task Brief Maker available.

**Architecture:** Add a dependency-free static app at `tools/lunch-learn/` with focused HTML, CSS, and JavaScript files. The JavaScript owns seeded partner/session/template data, local browser state, and testable helper functions; the GitHub Pages builder copies the new tool alongside the existing hub and Task Brief Maker.

**Tech Stack:** Static HTML/CSS, browser JavaScript modules, Node.js built-in test runner, GitHub Actions Pages deployment.

## Global Constraints

- Preserve the existing AgencyThings desktop and `/tools/digital-task-brief-maker/` deployment.
- Keep the Partner Desk usable without a backend or build step.
- Show email templates as formatted, copy-ready email content rather than raw Markdown.
- Do not repeat partner suggestion cards during one refresh cycle; reset only after the unseen pool is exhausted.
- Keep pipeline movement reversible and browser-persistent.
- Provide monthly and completed calendar views plus days-since-last and days-until-next metrics.
- Leave unrelated local Gen Alpha and `.playwright-mcp/` changes untouched.

---

### Task 1: Define the Partner Desk behavior contract

**Files:**
- Create: `tests/lunch-learn.test.mjs`
- Create: `tools/lunch-learn/src/app.js`

**Interfaces:**
- Produces: `nextSuggestionBatch(partners, seenIds, batchSize)`, `movePipelinePartner(pipeline, partnerId, direction)`, `calendarMetrics(sessions, now)`, and `filterPartners(partners, query)`.
- Consumes: plain partner and session objects stored in the module.

- [ ] **Step 1: Write failing helper tests**

Add tests that import the app module and assert: suggestion batches exclude seen IDs, forward and backward pipeline moves clamp at the ends, timing metrics return the expected day counts, and directory filtering is case-insensitive.

- [ ] **Step 2: Run the helper tests to verify RED**

Run: `node --test tests/lunch-learn.test.mjs`

Expected: FAIL because `tools/lunch-learn/src/app.js` does not exist.

- [ ] **Step 3: Implement minimal deterministic helpers and seed records**

Create the module with seeded partner, session, pipeline, and email-template records. Export pure helpers for tests, then guard DOM initialization behind `typeof document !== "undefined"`.

- [ ] **Step 4: Run the helper tests to verify GREEN**

Run: `node --test tests/lunch-learn.test.mjs`

Expected: PASS with zero failures.

### Task 2: Build the contained Partner Desk interface

**Files:**
- Create: `tools/lunch-learn/index.html`
- Create: `tools/lunch-learn/src/styles.css`
- Modify: `tools/lunch-learn/src/app.js`
- Modify: `tests/lunch-learn.test.mjs`

**Interfaces:**
- Consumes: seeded records and helper functions from Task 1.
- Produces: tabbed views for Suggestions, Pipeline, Calendar, Templates, and Directory plus browser-persistent interaction state.

- [ ] **Step 1: Add failing markup and interaction contract tests**

Assert the HTML contains the five workspace views, suggestion refresh and preference controls, reversible pipeline controls, calendar month/completed views, timing metrics, template tabs with copy controls, directory search, and partner-specific research links.

- [ ] **Step 2: Run the contract tests to verify RED**

Run: `node --test tests/lunch-learn.test.mjs`

Expected: FAIL because `index.html` and `styles.css` are missing.

- [ ] **Step 3: Implement the static interface**

Create a viewport-contained desktop with a fixed header, compact sidebar navigation, one scrollable main panel, responsive mobile stacking, accessible buttons and labels, formatted email cards, calendar month navigation, completed-session filtering, searchable directory rows, feedback controls, and partner research links that open targeted web searches.

- [ ] **Step 4: Wire interactions and persistence**

Use local storage for seen suggestions, feedback preferences, pipeline state, and the selected view. Make suggestions cycle through unseen records before resetting, allow both previous and next pipeline moves, render calendar metrics from session dates, and copy formatted email text with a safe fallback message.

- [ ] **Step 5: Run the contract tests to verify GREEN**

Run: `node --test tests/lunch-learn.test.mjs`

Expected: PASS with zero failures.

### Task 3: Integrate the Partner Desk into the AgencyThings site

**Files:**
- Modify: `index.html`
- Modify: `assets/hub.js`
- Modify: `scripts/build-pages-site.mjs`
- Modify: `tests/agencythings-hub.test.mjs`
- Modify: `README.md`

**Interfaces:**
- Consumes: the static app from Tasks 1 and 2.
- Produces: local hub launch links and a Pages artifact containing both static tools.

- [ ] **Step 1: Update the existing hub tests first**

Change the Lunch & Learn registry expectation from the retired Vercel URL to `./tools/lunch-learn/` with `external: false`. Add build-artifact access assertions for `tools/lunch-learn/index.html`, `src/styles.css`, and `src/app.js`.

- [ ] **Step 2: Run the hub tests to verify RED**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: FAIL because the registry, hub links, and builder still point elsewhere.

- [ ] **Step 3: Implement the integration**

Update both Lunch & Learn hub links, the registry record, and the Pages builder copy list. Document the new tool, capabilities, live path, and local preview path in the README.

- [ ] **Step 4: Run all static-site tests to verify GREEN**

Run: `node --test tests/agencythings-hub.test.mjs tests/lunch-learn.test.mjs`

Expected: PASS with zero failures.

### Task 4: Verify, publish, and validate GitHub Pages

**Files:**
- Modify if required: `.github/workflows/deploy-digital-task-brief-maker.yml`

**Interfaces:**
- Consumes: the complete static site and Pages builder.
- Produces: merged `main`, a successful Pages workflow run, and a verified public Lunch & Learn URL.

- [ ] **Step 1: Build the exact Pages artifact**

Run: `site_dir=$(mktemp -d) && node scripts/build-pages-site.mjs "$site_dir" && test -f "$site_dir/tools/lunch-learn/index.html" && test -f "$site_dir/tools/digital-task-brief-maker/index.html"`

Expected: exit 0.

- [ ] **Step 2: Run final verification**

Run: `node --test tests/agencythings-hub.test.mjs tests/lunch-learn.test.mjs && git diff --check`

Expected: all tests pass and `git diff --check` exits 0.

- [ ] **Step 3: Commit and push the scoped branch**

Stage only the plan, Partner Desk, hub, builder, tests, README, and workflow files. Commit with `Add Lunch & Learn partner desk`, then push `codex/lunch-learn-github-pages` to `origin`.

- [ ] **Step 4: Merge through GitHub and monitor Pages**

Open a pull request to `main`, merge it after checks pass, then monitor the Pages workflow for the merged `main` SHA.

- [ ] **Step 5: Verify the public site**

Open the GitHub Pages root and `/tools/lunch-learn/`; verify visible markers for the Partner Desk and confirm the existing Digital Task Brief Maker URL still returns its app.
