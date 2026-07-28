# Gen Alpha House Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an expansive, interactive Gen Alpha house as a separate companion site that opens rich mini-experiences and deep-links into the existing Intelligence Lab.

**Architecture:** Create a standalone Next.js app in `apps/gen-alpha-house` with a static typed content model, pure navigation helpers, a single wide generated house scene, keyboard-accessible hotspot buttons, and a responsive insight drawer. Keep all data local and treat the existing public Intelligence Lab as the source of truth for deeper content.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Vitest, Testing Library, CSS, generated WebP/PNG artwork.

## Global Constraints

- The current Gen Alpha Intelligence Lab and root GitHub Pages tool remain untouched.
- The app contains exactly 18 hotspots: five anchor, eight preview, and five ambient.
- Every hotspot is keyboard-focusable and has a visible text label.
- All deep links target `https://agencythings-gen-alpha.vercel.app` using approved routes.
- Motion respects `prefers-reduced-motion`.
- Desktop uses one wide house canvas; mobile exposes the same content through room crops and a text list.
- Day/night state supports system preference and a persistent visible control.

---

### Task 1: Scaffold the app and prove the content model

**Files:**
- Create: `apps/gen-alpha-house/package.json`
- Create: `apps/gen-alpha-house/tsconfig.json`
- Create: `apps/gen-alpha-house/next.config.mjs`
- Create: `apps/gen-alpha-house/next-env.d.ts`
- Create: `apps/gen-alpha-house/vitest.config.ts`
- Create: `apps/gen-alpha-house/tests/setup.ts`
- Create: `apps/gen-alpha-house/tests/house-data.test.ts`
- Create: `apps/gen-alpha-house/src/lib/house-types.ts`
- Create: `apps/gen-alpha-house/src/lib/house-data.ts`
- Create: `apps/gen-alpha-house/src/lib/house-state.ts`

**Interfaces:**
- Produces: `Room`, `Hotspot`, `HotspotKind`, `rooms`, `hotspots`, `getRoomHotspots(roomId)`, `getAdjacentRoom(roomId, direction)`.

- [ ] **Step 1: Add the package and test configuration.**

Use the existing Gen Alpha app versions and scripts: `next`, `react`, `react-dom`, `vitest`, `jsdom`, Testing Library, and TypeScript.

- [ ] **Step 2: Write failing content-model tests.**

```ts
expect(hotspots).toHaveLength(18);
expect(countByKind(hotspots)).toEqual({ anchor: 5, preview: 8, ambient: 5 });
expect(new Set(hotspots.map((item) => item.id)).size).toBe(18);
expect(hotspots.every((item) => rooms.some((room) => room.id === item.roomId))).toBe(true);
expect(hotspots.every((item) => item.position.x >= 0 && item.position.x <= 100)).toBe(true);
```

- [ ] **Step 3: Run `npm test -- tests/house-data.test.ts` and confirm it fails because the modules do not exist.**

- [ ] **Step 4: Implement the typed room/hotspot model and the 18-item dataset.**

Each hotspot includes an ID, label, room, kind, normalized percentage position, short title, takeaway, optional bullets, CTA label, optional lab URL, and accent color.

- [ ] **Step 5: Run the focused test and the full app test suite.**

Expected: both commands exit 0 with all tests passing.

### Task 2: Generate the visual concept and production house scene

**Files:**
- Create: `apps/gen-alpha-house/public/gen-alpha-house-concept.png`
- Create: `apps/gen-alpha-house/public/gen-alpha-house.webp`

**Interfaces:**
- Produces: a complete interface reference at desktop proportions and one clean environment asset with no code-native UI text baked into it.

- [ ] **Step 1: Generate a complete desktop concept.**

The concept must show quiet top chrome, arrival-free house mode, a wide two-floor cutaway house, visible cyan/coral object pulses, one open right-side insight drawer, restrained labels, and the approved night palette.

- [ ] **Step 2: Generate a clean matching house environment asset.**

The production scene contains the six rooms and recognizable interactive objects but no floating labels, navigation, buttons, or readable UI copy.

- [ ] **Step 3: Inspect both outputs with `view_image`.**

Reject any result with illegible composition, real brand logos, visible children, unsafe details, or a house layout that cannot support 18 hotspots.

- [ ] **Step 4: Copy the selected outputs into `public/` and record their dimensions.**

### Task 3: Build the application shell and interaction behavior test-first

**Files:**
- Create: `apps/gen-alpha-house/tests/house-experience.test.tsx`
- Create: `apps/gen-alpha-house/src/app/layout.tsx`
- Create: `apps/gen-alpha-house/src/app/page.tsx`
- Create: `apps/gen-alpha-house/src/components/HouseExperience.tsx`
- Create: `apps/gen-alpha-house/src/components/HouseCanvas.tsx`
- Create: `apps/gen-alpha-house/src/components/RoomNavigator.tsx`
- Create: `apps/gen-alpha-house/src/components/InsightDrawer.tsx`

**Interfaces:**
- Consumes: the typed dataset and helpers from Task 1.
- Produces: arrival overlay, room navigation, theme state, hotspot activation, drawer state, and deep-link rendering.

- [ ] **Step 1: Write failing interaction tests.**

```tsx
expect(screen.getByRole("heading", { name: "Come inside." })).toBeInTheDocument();
await user.click(screen.getByRole("button", { name: "Knock to enter" }));
expect(screen.getByRole("button", { name: "Open Creator phone" })).toBeInTheDocument();
await user.click(screen.getByRole("button", { name: "Open Creator phone" }));
expect(screen.getByRole("dialog", { name: "The creator feed" })).toBeInTheDocument();
```

Add separate tests for skipping to the map, closing the drawer, switching day/night, and selecting a room.

- [ ] **Step 2: Run the focused component test and confirm the missing component failure.**

- [ ] **Step 3: Implement the minimal component tree and state transitions.**

`HouseExperience` owns `entered`, `selectedRoom`, `selectedHotspot`, and `theme`. Child components receive explicit data and callbacks.

- [ ] **Step 4: Run the focused test until it passes, then run all tests.**

### Task 4: Implement the visual system, responsive canvas, and accessibility

**Files:**
- Create: `apps/gen-alpha-house/src/app/globals.css`
- Modify: `apps/gen-alpha-house/src/components/HouseCanvas.tsx`
- Modify: `apps/gen-alpha-house/src/components/RoomNavigator.tsx`
- Modify: `apps/gen-alpha-house/src/components/InsightDrawer.tsx`
- Create: `apps/gen-alpha-house/public/favicon.svg`

**Interfaces:**
- Consumes: the accepted concept and clean house asset.
- Produces: the final responsive visual implementation.

- [ ] **Step 1: Define exact color, type, spacing, border, shadow, and motion tokens from the concept.**

- [ ] **Step 2: Implement the desktop 16:9 canvas with percentage-positioned hotspots and a right-side drawer.**

- [ ] **Step 3: Implement mobile room cropping, room tabs, and stacked hotspot summaries at 390px.**

- [ ] **Step 4: Add focus-visible states, semantic dialog behavior, Escape-to-close, body scroll handling, and reduced-motion overrides.**

- [ ] **Step 5: Add ambient object classes for the record, lamp, screen, fan, and backyard light without audio.**

### Task 5: Verify, compare, and prepare deployment

**Files:**
- Create: `apps/gen-alpha-house/README.md`
- Create: `apps/gen-alpha-house/vercel.json`
- Modify: `apps/gen-alpha-house/package.json` only if verification requires a script adjustment.

**Interfaces:**
- Produces: a verified build and a separate Vercel-ready app root.

- [ ] **Step 1: Run `npm test` and confirm zero failures.**

- [ ] **Step 2: Run `npm run build` and confirm exit 0.**

- [ ] **Step 3: Use the in-app Browser to verify arrival, room navigation, one anchor, one preview, one ambient response, drawer close, day/night mode, and external link targets.**

- [ ] **Step 4: Verify desktop and 390px mobile without horizontal page overflow or inaccessible content.**

- [ ] **Step 5: Capture the implementation at the concept's native dimensions and inspect both images with `view_image`.**

- [ ] **Step 6: Write a fidelity ledger covering copy, layout, typography, palette, art treatment, hotspot placement, drawer composition, responsive behavior, and motion. Fix every material mismatch.**

- [ ] **Step 7: Re-run tests, build, and `git diff --check`, then commit only the new app and its documentation.**
