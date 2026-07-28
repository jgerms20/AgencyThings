# Gen Alpha House Design

## Product Shape

Build **Gen Alpha House**, a separate companion website inside `apps/gen-alpha-house/`. It sits beside the existing Gen Alpha Intelligence Lab rather than replacing or modifying it. The house is an immersive exploratory layer; the Intelligence Lab remains the authoritative research surface.

The experience borrows the spatial-navigation idea from Cameron Bell's portfolio without copying its room, imagery, typography, or portfolio structure. The new signature is a wide, illustrated cutaway house at blue hour where each room represents a different part of Gen Alpha life.

## Audience and Job

The primary audience is agency strategists, creative teams, and clients who need an immediate, memorable way to enter the Gen Alpha research.

The site's single job is to turn the existing field guide into a place people want to explore, then route them into the full evidence and insight pages when they want depth.

## Experience Architecture

The app has three layers:

1. **Arrival:** a short, optional "knock to enter" opening that sets the tone without blocking repeat visits.
2. **House canvas:** one expansive, horizontally pannable cutaway house with six recognizable zones and visible interactive objects.
3. **Insight drawer:** object interactions open either a rich local mini-experience, a concise preview with a deep link, or a small ambient response.

The six zones are:

- **Creator bedroom:** identity, creators, media, style, and culture shapers.
- **Gaming den:** play, belonging, avatars, friendship, and multiplayer spaces.
- **AI study:** learning, conversational discovery, AI literacy, and guardrails.
- **Kitchen:** family influence, household decisions, food, shopping, and routines.
- **Living room:** shared media, fandom, streaming, sports, and co-viewing.
- **Garage and backyard:** school, movement, sports, parks, offline reset, and hybrid spaces.

## Interaction Model

The house contains 18 hotspots with three behavior types:

- **Five anchor experiences** open rich drawers with multiple insights, a small interaction, and links into the Intelligence Lab.
- **Eight insight previews** open a focused insight card with one evidence-backed takeaway and a deep link.
- **Five ambient objects** respond locally through sound-free motion, light, or a short caption.

Anchor experiences:

- **Phone / creator feed:** cycle through culture shapers and open the full Influencers directory.
- **Game console / crew lobby:** explore play-and-belonging insights and open the relevant comparison view.
- **AI laptop / prompt desk:** step through learning-and-AI scenarios and open deeper insights.
- **Fridge / household board:** reveal family, routine, and commerce signals.
- **Television / shared screen:** cycle through media, fandom, sport, and co-viewing insights.

Ambient interactions include a spinning record, a pulsing lava lamp, a flickering screen, a moving ceiling fan, and a backyard light. Motion must respect `prefers-reduced-motion`.

Every hotspot is keyboard-focusable, has a visible focus state, and has a real text label. The site never depends on invisible image maps alone.

## Navigation and Copy

Persistent chrome is intentionally quiet:

- Brand: `Gen Alpha House`
- Utility: `House map`
- Primary link: `Open the Intelligence Lab`
- Environment control: `Day` / `Night`

Arrival copy:

- Heading: `Come inside.`
- Supporting line: `A field guide to Gen Alpha, built as the places their days actually happen.`
- Primary action: `Knock to enter`
- Secondary action: `Skip to the map`

House instruction:

- `Move through the house. Everything with a pulse has something to say.`

No decorative eyebrow, fake metric, or generic marketing section appears above the house.

## Visual Direction

The environment is a cinematic editorial illustration rather than a photoreal apartment. It combines a contemporary dollhouse cutaway, tactile miniature-set materials, and subtle digital overlays. The house feels inhabited but no children are shown.

Palette:

- Night ink: `#0A0B18`
- Blue-hour violet: `#27254F`
- Warm window light: `#FFD27A`
- Screen cyan: `#6EF2FF`
- Signal coral: `#FF6B6B`
- Paper white: `#F7F4EC`

Typography:

- Display: `Space Grotesk`, bold and tightly spaced.
- Body and controls: `Inter`, highly readable.
- Object labels and research metadata: `IBM Plex Mono`.

The single aesthetic risk is the full-house canvas: the website behaves more like an explorable editorial set than a conventional page. Everything around it stays restrained.

## Responsive Behavior

Desktop and tablet use the wide house canvas with pointer, keyboard, drag, and horizontal-scroll navigation. The layout opens near the center and exposes room navigation controls.

Mobile uses the same house art in room-sized crops, with a room selector and a clear stacked object list beneath each crop. Drawers become full-height sheets. All content and links remain available without precision tapping.

## Architecture

Use an isolated Next.js 16 + React 19 + TypeScript app at `apps/gen-alpha-house/`, matching the existing Gen Alpha app's deployment shape. The app is static and does not need a backend.

Key units:

- `src/lib/house-data.ts`: room, hotspot, insight, and deep-link data.
- `src/lib/house-state.ts`: pure helpers for filtering hotspots, navigation, and theme behavior.
- `src/components/HouseExperience.tsx`: top-level state and composition.
- `src/components/HouseCanvas.tsx`: responsive image canvas and hotspot positioning.
- `src/components/InsightDrawer.tsx`: anchor, preview, and ambient detail states.
- `src/components/RoomNavigator.tsx`: map, room selection, and mobile fallback.
- `src/app/globals.css`: tokens, responsive layout, motion, focus, and day/night treatments.

The app links to `https://agencythings-gen-alpha.vercel.app` for authoritative content. Deep links use the existing routes for insights, influencers, spaces, reach, compare, and library.

## Testing and Acceptance

Automated tests must cover:

- All 18 hotspots have unique IDs, valid room assignments, labels, positions, and safe deep links.
- Five anchor, eight preview, and five ambient behaviors exist.
- Room filtering and next/previous room navigation are deterministic.
- The arrival overlay can be entered or skipped.
- Hotspot activation opens the correct drawer content.
- Day/night controls update state and accessible labels.
- Mobile room navigation exposes the same hotspot set as desktop.

Acceptance requires:

- `npm test` passes.
- `npm run build` passes.
- Browser verification covers arrival, room navigation, all three hotspot types, drawer close behavior, day/night mode, desktop layout, 390px mobile layout, keyboard focus, and reduced motion.
- The final browser screenshot is visually compared with the accepted generated concept using `view_image`.
- The current Gen Alpha Intelligence Lab remains untouched.

## Deployment Shape

The finished app is ready to deploy as a new Vercel project with root directory `apps/gen-alpha-house`. A future production alias can be assigned without changing `agencythings-gen-alpha.vercel.app` or the existing root GitHub Pages tool.
