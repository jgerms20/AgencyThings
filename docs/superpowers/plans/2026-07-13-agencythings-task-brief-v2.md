# AgencyThings And Task Brief V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Joshua's personal hub and the Task Brief visual experience while preserving every validated Task Brief behavior and launching it from its own Vercel project.

**Architecture:** The static AgencyThings registry gains action modes (`make`, `think`, `learn`) and project-owned accent behavior. Task Brief retains its existing HTML and JavaScript contracts; its CSS and non-behavioral markup are modernized without changing event IDs or workflow functions. A Vercel config inside the tool directory serves the static application independently.

**Tech Stack:** Semantic HTML, CSS, browser JavaScript, Node built-in tests, Vercel static hosting.

## Global Constraints

- Task Brief parsing, grouping, review, source, customization, and export logic must remain unchanged.
- Existing DOM IDs consumed by `src/app-upgraded.js` must remain present exactly once.
- Hub tool modes are exactly `make`, `think`, and `learn`.
- Tool accents are cobalt blue, coral-red, and acid green.
- Hover lift is 4px and disabled under `prefers-reduced-motion`.
- No marketing hero, fake metrics, fake activity, or team features.

---

### Task 1: Personal Hub Modes And Accent Interaction

**Files:**
- Modify: `index.html`
- Modify: `assets/hub.js`
- Modify: `assets/hub.css`
- Modify: `tests/agencythings-hub.test.mjs`

**Interfaces:**
- Consumes: the existing `projects`, `filterProjects`, `activateView`, and `initHub` exports.
- Produces: project records with `mode: "make" | "think" | "learn"`; action-mode navigation and accent hover behavior.

- [ ] **Step 1: Write failing hub tests**

Add assertions that project modes are `make`, `think`, and `learn`; the upper-left visible identity contains `Joshua's AgencyThings`; navigation exposes Home, Make, Think, Learn; and the CSS includes `translateY(-4px)` plus reduced-motion override.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: failure because the current project registry and navigation use `Current` and `All things`.

- [ ] **Step 3: Implement the modes**

Extend each project record with its action mode. Replace `Current` and `All things` buttons with Make, Think, Learn. Update `activateView` so Home shows all projects and a mode shows only matching project elements. Update visible identity to `Joshua's AgencyThings`. Use `--accent` on each project row for label, launch, focus, and hover shadow; lift the whole row 4px.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: all hub registry, markup, filtering, and artifact tests pass.

### Task 2: Task Brief Visual-Only Refresh

**Files:**
- Modify: `tools/digital-task-brief-maker/index.html`
- Modify: `tools/digital-task-brief-maker/src/styles.css`
- Modify: `tools/digital-task-brief-maker/src/upgrade-styles.css`
- Create: `tests/digital-task-brief-maker/ui-contract.test.mjs`

**Interfaces:**
- Consumes: all selectors and IDs used by `src/app.js` and `src/app-upgraded.js`.
- Produces: a current production-tool layout with the same workflow controls and data flow.

- [ ] **Step 1: Write the UI contract test**

Parse `index.html` as text and assert that every ID referenced through `qs('#...')` in both application scripts remains present exactly once. Assert step labels Upload, Review, Sources, Customize, Export and export controls remain visible.

- [ ] **Step 2: Verify the contract baseline**

Run: `node --test tests/digital-task-brief-maker/ui-contract.test.mjs`

Expected: pass on the current application, establishing the frozen behavior surface.

- [ ] **Step 3: Refresh non-behavioral markup and CSS**

Keep all contract IDs. Recompose the header, step navigation, upload area, review list, source packs, customization controls, and export preview using open bands, compact workflow chrome, cobalt accents, 8px maximum radii, deliberate button hierarchy, and stable responsive dimensions. Do not edit `src/app.js`, `src/app-upgraded.js`, or `src/mediaPlan.js`.

- [ ] **Step 4: Verify the frozen contract and parser tests**

Run: `node --test tests/digital-task-brief-maker/ui-contract.test.mjs tests/digital-task-brief-maker/media-plan.test.mjs`

Expected: all UI contract and media-plan tests pass.

### Task 3: Independent Vercel Hosting

**Files:**
- Create: `tools/digital-task-brief-maker/vercel.json`
- Modify: `assets/hub.js`
- Modify: `index.html`
- Modify: `tests/agencythings-hub.test.mjs`

**Interfaces:**
- Consumes: static Task Brief files under `tools/digital-task-brief-maker`.
- Produces: Vercel project configuration and one stable hub launch URL.

- [ ] **Step 1: Write the failing destination test**

Assert the Task Brief project URL is `https://agencythings-task-brief.vercel.app` and is treated as external. Assert `vercel.json` rewrites `/` to `/index.html` without moving source files.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/agencythings-hub.test.mjs`

Expected: failure because Task Brief still launches the Pages subpath.

- [ ] **Step 3: Add hosting configuration and update links**

Create:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [{ "source": "/", "destination": "/index.html" }]
}
```

Update registry, launch anchors, and directory anchors to the production alias while preserving the Pages path in README documentation as fallback.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/agencythings-hub.test.mjs tests/digital-task-brief-maker/ui-contract.test.mjs`

Expected: all tests pass.

### Task 4: Browser And Deployment Verification

**Files:**
- Verify: hub and Task Brief changed files

**Interfaces:**
- Produces: visual, interaction, responsive, and live deployment evidence.

- [ ] **Step 1: Run all static suites**

Run both hub and Task Brief test files plus existing media-plan tests.

- [ ] **Step 2: Verify hub and Task Brief locally**

Use Browser at desktop and 390px. Exercise Home/Make/Think/Learn, search, hover/focus, Load sample, each workflow step, and one export action. Confirm no console errors or horizontal overflow.

- [ ] **Step 3: Deploy Task Brief to its Vercel project**

Create or link project `agencythings-task-brief`, set root to `tools/digital-task-brief-maker`, deploy production, and verify the stable alias.

- [ ] **Step 4: Verify visual fidelity**

Compare accepted concepts and final screenshots with `view_image`; fix material differences before publication.

