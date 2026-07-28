# Gen Alpha Insight Room and Gender Lens Design

## Purpose

Refocus the Gen Alpha House from a six-room navigation exercise into one believable Gen Alpha bedroom where every interactive object represents a meaningful bundle of sourced insights. Extend the Intelligence Lab with a presentation-ready briefing layer, a responsible gender lens, and a visible source-validity standard. Add the House to the Agency Things hub as a separate product from the Lab.

## Product roles

- **Gen Alpha House:** experiential entry point. It helps a viewer feel how the research appears in a child's ordinary day.
- **Gen Alpha Intelligence Lab:** analytical source of truth. It holds full insight, evidence, methodology, source, and strategy detail.
- **Agency Things hub:** directory. It lists the House and Lab as separate tools with separate production URLs.

## Chosen spatial model

Use one cinematic bedroom rather than a multi-room house. The room includes eight recognizable objects:

1. **Phone:** personal device access, private media moments, creator influence, and commerce.
2. **Television:** YouTube/video rhythm, shared viewing, culture shapers, and entertainment discovery.
3. **Laptop and homework desk:** AI homework, AI discovery, verification literacy, and multimodal learning.
4. **Game console and headset:** social play, friendship across platforms, collaboration, and safety boundaries.
5. **Backpack and notebook:** learning across school, video, games, search, and family support.
6. **Toy and story shelf:** analog play, identity, fandom, creation, and the movement of properties between physical and digital play.
7. **Open door / parent cue:** context, rules, permissions, purchases, privacy, and household inequality.
8. **Window, bike, and yard:** offline play, movement, local friendship, and the coexistence of screen and physical life.

The old bottom room navigator, six-room labels, ambient-only dots, and one-insight-per-object model are removed.

## House interaction and information display

The full room remains visible on desktop. Each object has one accessible pulse. Selecting an object opens an editorial drawer containing:

- a plain-language object thesis;
- three or four linked insight cards;
- confidence, evidence count, age/scope, and source organizations for each insight;
- an individual link from every insight card to its exact Intelligence Lab detail route;
- one contextual note describing why the object represents the research.

On mobile, the room becomes a responsive crop with a compact object index beneath it. The index is not spatial navigation; it is an accessible alternative for opening the same object bundles.

## Intelligence Lab gender lens

Add a top-level `Gender Lens` route and navigation item. The route has four tabs:

- **All:** the most defensible cross-gender patterns and the strongest measured differences.
- **Boys:** gaming frequency, console access, gaming friendship, YouTube, and related trade-offs.
- **Girls:** TikTok/Instagram use, screen-time self-assessment, gaming participation and genre diversity, and representation.
- **Gender-diverse:** identity expression, online connection, affirming spaces, and safety. This view must label older-youth proxies and non-probability studies clearly and must not fabricate Gen Alpha prevalence estimates.

Every data point shows population, age range, geography, fieldwork period, methodology, limitation, source organization, and a direct source link. “Boys” and “girls” reflect the labels used by the cited studies; the interface explains that sex and gender measures vary across research.

## Presentation-ready briefing

Add a top-level `Briefing` route built for talking through the work. It contains six executive insights:

1. Screens are places, not channels.
2. Friendship is the through-line across games, chat, video, school, and physical life.
3. AI is already part of homework before guidance has caught up.
4. Parents manage context, permission, purchases, and privacy—not only minutes.
5. Video and creator influence collapse entertainment, discovery, and persuasion.
6. Offline play is part of the same identity system, not an escape from digital culture.

Each briefing block includes a slide-ready sentence, two or three proof points, caveats, exact insight links, and an associated House object.

## Source validity standard

The Briefing and Gender Lens expose a four-level evidence standard:

1. **Representative evidence:** probability samples, government/regulator studies, peer-reviewed synthesis, or nationally weighted panels.
2. **Rigorous qualitative evidence:** longitudinal observation or interviews with transparent methods; useful for how and why, not prevalence.
3. **Directional industry or platform evidence:** useful for current behavior and product context, but limited by commercial incentives or platform scope.
4. **Agency synthesis:** interpretation that connects sources; always labeled and never presented as a measured fact.

The Lab already stores methodology, population, age, geography, fieldwork, confidence, and limitations. New presentation surfaces reuse those fields instead of creating unsupported claims.

## Hub integration

Add `Gen Alpha House` as a seventh Agency Things project:

- mode: Learn
- type: Interactive Field Guide
- destination: `https://agencythings-gen-alpha-house.vercel.app`
- separate from `Gen Alpha Intelligence Lab`

Update the visual project stack, directory list, search registry, recent-project behavior, and hub tests.

## Architecture

- Consolidate the current `origin/main` hub and Lab with the existing `apps/gen-alpha-house` app on `codex/gen-alpha-insight-room`.
- Replace House room types with object-bundle types that reference Lab insight IDs.
- Reuse the Lab content graph for titles, confidence, evidence counts, sources, and detail URLs through a small curated export in the House; keep the companion deploy independent.
- Add dedicated, typed Lab content modules for gender lenses, briefing sections, and source validity assessment.
- Keep existing evidence, routes, uploads, and deployments intact.

## Error handling and responsible limits

- House insight links use known Lab IDs and are validated in tests.
- Missing optional source metadata falls back to an explicit “not reported” label.
- Gender-diverse evidence is presented as a needs and inclusion lens when data is not representative.
- No subgroup claim is generalized beyond its reported ages, geography, or method.
- External links open safely with `rel="noreferrer"`.

## Testing and acceptance

- Hub tests verify seven distinct projects and both Gen Alpha destinations.
- House tests verify eight object bundles, no room navigator, multiple unique insight links per object, and mobile object access.
- Lab tests verify gender tabs, caveat labels, source links, briefing sections, insight deep links, and validity bands.
- Both Next.js apps must pass their full test suites and production builds.
- The GitHub Pages hub tests and build must pass.
- Browser QA covers the hub, one House object-to-Lab flow, all gender tabs, the briefing route, desktop, mobile, console health, and live production deployments.

## Explicit non-goals

- No demographic stereotyping or claims that all boys, girls, or gender-diverse children behave alike.
- No new database schema or upload workflow changes.
- No replacement of the Intelligence Lab or House production projects.
- No new multi-room navigation.
