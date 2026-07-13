# AgencyThings Desktop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the Digital Task Brief redirect with Joshua's personalized AgencyThings desktop and provide reliable launch paths into the three bespoke agency tools.

**Architecture:** The GitHub Pages root is a dependency-free static workspace driven by a small JavaScript project registry. The Digital Task Brief Maker remains under the same Pages origin, while Problem Wall and Gen Alpha remain independent Vercel applications linked from the hub. The Pages workflow packages the root hub assets and the Task Brief directory into one artifact.

**Tech Stack:** Semantic HTML, CSS, browser JavaScript, Node.js built-in test runner, GitHub Actions, GitHub Pages, Vercel.

## Global Constraints

- The hub is an internal agency workspace, not a public portfolio or marketing page.
- The hub provides shared orientation but does not restyle the three tools into one visual system.
- Digital Task Brief Maker remains at `./tools/digital-task-brief-maker/`.
- Problem Wall remains at `https://agencythings-problem-wall.vercel.app`.
- Gen Alpha remains at `https://agencythings-gen-alpha.vercel.app`.
- The first release does not invent collaborators, activity, metrics, notifications, authentication, or project-creation behavior.
- The hub must work without JavaScript for basic project launching.
- The hub must not overflow or overlap at 390px viewport width.

---

### Task 1: Hub Contract And Project Registry

**Files:**
- Create: `tests/agencythings-hub.test.mjs`
- Create: `assets/hub.js`

**Interfaces:**
- Consumes: Browser DOM APIs and `[data-project-search]`, `[data-project]`, `[data-view]`, and `[data-nav-target]` attributes from `index.html`.
- Produces: Exported `projects`, `filterProjects(query)`, and `activateView(view)` behavior for the hub and tests.

- [x] **Step 1: Write the failing registry test**

Create a Node test that imports `projects` and `filterProjects`, then asserts the exact three project IDs, destinations, internal/external launch behavior, and case-insensitive filtering by project type.

- [x] **Step 2: Run the test and verify RED**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: FAIL because `assets/hub.js` does not exist.

- [x] **Step 3: Implement the project registry**

Create `assets/hub.js` with the three exact project records, pure filtering logic, guarded DOM initialization, view switching, search updates, keyboard-safe buttons, and local last-opened tracking. Basic anchor navigation must remain functional before JavaScript initializes.

- [x] **Step 4: Run the test and verify GREEN**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: 3 project registry and filtering tests pass.

### Task 2: Agency Desktop Interface

**Files:**
- Modify: `index.html`
- Create: `assets/hub.css`
- Create: `assets/previews/task-brief.webp`
- Create: `assets/previews/problem-wall.webp`
- Create: `assets/previews/gen-alpha.webp`
- Modify: `tests/agencythings-hub.test.mjs`

**Interfaces:**
- Consumes: Project records and DOM behavior from `assets/hub.js`.
- Produces: Semantic desktop markup, real application preview assets, responsive styling, and accessible launch paths.

- [x] **Step 1: Extend the test with the HTML contract**

Assert that `index.html` no longer contains redirect behavior, contains `Joshua's AgencyThings`, includes all three project destinations, references `assets/hub.css` and `assets/hub.js`, and marks external destinations with `target="_blank"` plus `rel="noreferrer"`.

- [x] **Step 2: Run the test and verify RED**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: FAIL because the current root still redirects directly to Digital Task Brief Maker.

- [x] **Step 3: Create the approved visual concept and project previews**

Generate one complete Agency Desktop concept from the approved design spec. Capture or derive clear preview imagery from the three real applications and save optimized WebP assets under `assets/previews/`.

- [x] **Step 4: Implement the semantic hub**

Replace `index.html` with the agency desktop frame: compact navigation rail, personal workspace header, current-work composition, search, all-things directory, factual project states, and three project launch anchors. Add `assets/hub.css` with the approved design tokens, asymmetric desktop layout, project-specific accents, focus states, reduced-motion handling, and 390px responsive behavior.

- [x] **Step 5: Run the test and verify GREEN**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: All registry, filtering, and markup contract tests pass.

### Task 3: GitHub Pages Packaging

**Files:**
- Modify: `.github/workflows/deploy-digital-task-brief-maker.yml`
- Modify: `README.md`
- Modify: `tests/agencythings-hub.test.mjs`

**Interfaces:**
- Consumes: Root `index.html`, `assets/`, and `tools/digital-task-brief-maker/`.
- Produces: `_site/index.html`, `_site/assets/`, and `_site/tools/digital-task-brief-maker/` in the Pages artifact.

- [x] **Step 1: Extend the test with the deployment contract**

Assert that the workflow copies the root hub files and assets, preserves the Task Brief subdirectory, and no longer copies the Task Brief contents directly into `_site/`.

- [x] **Step 2: Run the test and verify RED**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: FAIL because the workflow currently publishes only the Task Brief directory at the root.

- [x] **Step 3: Update Pages packaging and repository documentation**

Change the workflow to copy `index.html`, `assets/`, and `tools/digital-task-brief-maker/` into their correct artifact paths. Rename the workflow and deployment summary for AgencyThings. Update the README with the hub architecture, local preview command, and exact deployment destinations.

- [x] **Step 4: Run the test and verify GREEN**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: All hub and deployment contract tests pass.

### Task 4: Full Verification And Publication

**Files:**
- Verify: `index.html`
- Verify: `assets/hub.css`
- Verify: `assets/hub.js`
- Verify: `.github/workflows/deploy-digital-task-brief-maker.yml`
- Verify: all three application test suites

**Interfaces:**
- Consumes: Complete hub and existing application deployments.
- Produces: Browser, test, build, and live deployment evidence.

- [x] **Step 1: Run all local tests and builds**

Run the hub Node test, the Task Brief Node tests, the Gen Alpha Vitest suite and build, and the Problem Wall Vitest suite and build from a clean branch source.

- [x] **Step 2: Verify the hub in a browser**

Serve the repository root, inspect desktop and 390px mobile layouts, use search and navigation, and open all three project destinations. Capture the latest hub screenshot.

- [x] **Step 3: Complete visual fidelity review**

Inspect the approved concept and latest implementation screenshot with `view_image`. Compare identity, layout hierarchy, project-world previews, typography, colors, spacing, responsive behavior, and above-the-fold copy. Fix every material mismatch.

- [x] **Step 4: Publish and verify live**

Commit only intended hub and Gen Alpha branch files, push the branch, update the pull request, merge after successful checks, and confirm the GitHub Pages root shows the AgencyThings desktop while every launch destination returns its intended application.
