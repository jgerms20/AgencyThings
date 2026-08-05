# Digital Task Brief Placement Decks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an editable table-to-placement workflow that produces a template-first, one-placement-per-slide PowerPoint with verified sources and selectable imagery.

**Architecture:** Add pure table, source, duration, and deck-planning functions to `mediaPlan.js`; keep DOM rendering and browser file handling in `app-upgraded.js`. Extend the placement catalog with verified source and candidate-image metadata. Recompose the existing static HTML/CSS around the same five-step workflow while preserving accessibility and theme behavior.

**Tech Stack:** Semantic HTML, CSS, browser JavaScript modules, JSZip, SheetJS, PptxGenJS, Node built-in tests.

## Global Constraints

- Use the Lower Sugar workbook and 18-slide reference deck as acceptance fixtures.
- Do not create another Git branch.
- Keep the five workflow steps and persistent light/dark toggle.
- One placement per content slide.
- Divider and closing slides default on; appendix defaults off.
- Do not present generic Google Image searches as sourced examples.
- Do not claim arbitrary-template fidelity unless the exported PPTX is rendered and verified.

---

### Task 1: Editable Named Tables

**Files:**
- Modify: `tools/digital-task-brief-maker/src/mediaPlan.js`
- Modify: `tools/digital-task-brief-maker/src/app-upgraded.js`
- Modify: `tools/digital-task-brief-maker/index.html`
- Modify: `tools/digital-task-brief-maker/src/upgrade-styles.css`
- Modify: `tests/digital-task-brief-maker/media-plan.test.mjs`
- Modify: `tests/digital-task-brief-maker/ui-contract.test.mjs`

**Interfaces:**
- Produces: `createPlanTable(name, rows)`, `renamePlanTable(tables, id, name)`, `duplicatePlanTable(tables, id)`, `removePlanTable(tables, id)`, `planTablesToText(tables)`.

- [ ] **Step 1: Write failing tests** for named table creation, rename, duplicate, removal without deleting the last table, and literal tab-delimited serialization.
- [ ] **Step 2: Run** `node --test tests/digital-task-brief-maker/media-plan.test.mjs` and confirm the new exports are missing.
- [ ] **Step 3: Implement the pure table functions** with canonical nine-column rows and stable IDs supplied by the caller.
- [ ] **Step 4: Run the media-plan tests** and confirm they pass.
- [ ] **Step 5: Add the table tabs, editable grid, row controls, and compact paste action** while keeping `#plan-input` as a hidden serialization boundary for the parser.
- [ ] **Step 6: Extend the UI contract test** to require Add table, Rename, Duplicate, Remove, Add row, and the editable table region.
- [ ] **Step 7: Run both Task Brief suites** and confirm they pass.

### Task 2: Channel Review And Duration Variants

**Files:**
- Modify: `tools/digital-task-brief-maker/src/mediaPlan.js`
- Modify: `tools/digital-task-brief-maker/src/app-upgraded.js`
- Modify: `tools/digital-task-brief-maker/src/upgrade-styles.css`
- Modify: `tests/digital-task-brief-maker/media-plan.test.mjs`

**Interfaces:**
- Produces: `extractDurationVariants(value)` returning normalized values such as `[':15', ':30']`; `buildDurationSpecBlocks(group)` returning one block per duration.

- [ ] **Step 1: Write failing literal tests** proving `:15s or :30s`, `:15s / :30s`, and `15-30 sec` retain both duration variants.
- [ ] **Step 2: Run the focused tests** and confirm the exports are missing.
- [ ] **Step 3: Implement duration extraction and spec blocks** without splitting a placement into duplicate review decisions.
- [ ] **Step 4: Render stable channel accent classes** from normalized bucket names and show duration blocks in review and sources.
- [ ] **Step 5: Run both Task Brief suites** and confirm they pass.

### Task 3: Verified Sources And Image Selection

**Files:**
- Modify: `tools/digital-task-brief-maker/data/placements.json`
- Modify: `tools/digital-task-brief-maker/src/mediaPlan.js`
- Modify: `tools/digital-task-brief-maker/src/app-upgraded.js`
- Modify: `tools/digital-task-brief-maker/src/upgrade-styles.css`
- Modify: `tests/digital-task-brief-maker/media-plan.test.mjs`

**Interfaces:**
- Produces: `verifiedSourceUrls(group)`, `imageCandidates(group)`, and `selectImageCandidate(state, groupKey, candidateId)`.

- [ ] **Step 1: Write failing tests** requiring the current Pinterest spec URL, rejecting the old 404 URL and Google search URLs, and returning at most three attributed candidate objects.
- [ ] **Step 2: Run the focused tests** and confirm the current catalog fails.
- [ ] **Step 3: Update the catalog and source mapping** with verified official URLs and curated candidate metadata for supported placements.
- [ ] **Step 4: Replace search tiles with three selectable candidate cards**, manual URL fallback, attribution, and explicit no-image state.
- [ ] **Step 5: Run both Task Brief suites** and confirm they pass.

### Task 4: Template-First Controls And Deck Sequence

**Files:**
- Modify: `tools/digital-task-brief-maker/index.html`
- Modify: `tools/digital-task-brief-maker/src/mediaPlan.js`
- Modify: `tools/digital-task-brief-maker/src/app-upgraded.js`
- Modify: `tools/digital-task-brief-maker/src/upgrade-styles.css`
- Modify: `tests/digital-task-brief-maker/media-plan.test.mjs`
- Modify: `tests/digital-task-brief-maker/ui-contract.test.mjs`

**Interfaces:**
- Produces: `buildDeckSequence(groups, options)` with roles `title`, `timing`, `divider`, `placement`, `appendix`, `closing`.

- [ ] **Step 1: Write failing sequence tests** using TVC, POLV, and two Audio placements; assert every placement has its own slide and divider/closing options work.
- [ ] **Step 2: Run the focused tests** and confirm `buildDeckSequence` is missing.
- [ ] **Step 3: Implement the sequence builder** and keep `buildSlidePlan` as a compatibility wrapper.
- [ ] **Step 4: Reorder Customize** so template import is first; add campaign date and timing/divider/closing/appendix checkboxes; remove brand presets.
- [ ] **Step 5: Update preview and exports** to use role-based sequence, real placement titles, selected imagery, and appendix only when enabled.
- [ ] **Step 6: Run both Task Brief suites** and confirm they pass.

### Task 5: Lower Sugar Export And Browser QA

**Files:**
- Verify: `tools/digital-task-brief-maker/*`
- Verify: `tests/digital-task-brief-maker/*`

**Interfaces:**
- Consumes: Lower Sugar workbook and reference PPTX.
- Produces: verified browser workflow and rendered PowerPoint evidence.

- [ ] **Step 1: Run** `node --test tests/digital-task-brief-maker/*.test.mjs`, `node --check tools/digital-task-brief-maker/src/app-upgraded.js`, and `git diff --check`.
- [ ] **Step 2: Start the static app locally** and import the Lower Sugar workbook.
- [ ] **Step 3: Exercise table add/rename/remove, channel review, duration blocks, image selection, template import, and deck preview** in Browser with no console errors.
- [ ] **Step 4: Export PowerPoint**, render every slide, and check one placement per slide, divider order, closing slide, images, clipping, and overflow.
- [ ] **Step 5: Fix any QA defects and repeat the full verification commands** before reporting completion.

