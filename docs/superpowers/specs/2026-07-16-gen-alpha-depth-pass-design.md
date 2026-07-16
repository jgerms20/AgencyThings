# Gen Alpha Depth Pass Design

## Purpose

Turn the accepted Gen Alpha Intelligence Lab into a richer, more playable internal briefing without returning to the density of earlier versions. The experience should lead with clear interpretation, then allow Joshua to expand, play, filter, compare, and open evidence only when useful.

## Information Architecture

The primary navigation remains seven destinations with one copy change: `Overview`, `Insights`, `Influencers`, `Spaces`, `How to reach them`, `Compare`, and `Library`.

- `Overview` becomes a useful front door: a stronger editorial title, four insight tabs, culture-shaper and space previews, three expandable reach principles, a topic-driven Gen Alpha versus Gen Z snapshot, and a curated media shelf containing two podcasts, two videos, two articles, two books, and two reports.
- `Insights` keeps the four evidence-backed systems and 40 insights. Each directory row becomes an accessible disclosure that reveals quick-hit interpretation, nuance, confidence, and an explicit link to the full detail page.
- `Influencers` retains creators, artists, athletes, and combines `screen-ip` plus `franchise` into one user-facing `IP` filter. The canonical graph will contain at least 30 artists, at least 12 athletes, and at least 12 IP records, with complete profile pages, meaningful Gen Alpha relevance, imagery where a reliable source is available, and honest confidence language.
- `Spaces` keeps its filters, adds more physical spaces, and adds optional usage videos to selected space records so the page can show children and communities using the environment rather than only describing it.
- `How to reach them` compresses eight long strategy essays into a scannable set of bold plays. The first view shows one sentence, child value, best fit, and a guardrail. Expanding a play reveals formats, supporting insights, and sources. Safety boundaries remain prominent but concise.
- `Compare` becomes a topic-driven comparison tool. Users choose a topic and a comparison cohort (`Gen Z`, `Gen X`, or `Boomers`). The result shows a short mentality statement for Gen Alpha, a short statement for the selected cohort, the strategic difference between them, supporting stats/evidence, and a visible caveat. Inferred generational interpretation must be labeled as interpretation rather than measured fact.
- `Library` orders filters as `All`, `Podcasts`, `Videos`, `Articles`, `Reports`, `Books`. It contains at least ten Gen Alpha podcast records and at least seven videos. Spotify records render playable embeds; YouTube records render privacy-enhanced embeds. Eclectic Polymath appears first in Podcasts with a distinct outline and featured label.

## Media And Imagery

The Eclectic Polymath episode uses Spotify's supported episode embed so the official episode artwork and playback controls render directly. Overview and Library reuse one embed component to avoid duplicate URL parsing and iframe policy.

Culture-shaper imagery uses local, attributed assets when practical and reliable remote artwork only when the source is stable and permitted. The UI must never render a broken image: records without a valid portrait use an intentional typographic treatment. Bluey, KPop Demon Hunters, Wednesday, Disney Princess, and other featured IP should receive working artwork before being featured on Overview.

Videos use `youtube-nocookie.com`, load lazily, and remain optional enhancements. A blocked or unavailable embed must leave the title, explanation, and external link usable.

## Content Integrity

The existing evidence graph remains canonical. New culture-shaper profiles may use cohort-level research to explain the mechanism of influence, but may not claim private audience demographics or child-specific reach unless a source measures it. Each inferred audience center includes a confidence rationale.

The artist roster should reflect the music Gen Alpha encounters through chart scale, family listening, games, films, short video, fandom, and youth-facing culture, not imply that all members of the cohort share one taste. The athlete roster should cover global football, basketball, gymnastics, tennis, track, baseball, and emerging college/NIL attention with gender and cultural diversity.

Comparison copy must separate three classes:

1. age-matched observed evidence;
2. current cohort snapshots;
3. directional editorial interpretation.

## Interaction And Visual System

The current high-contrast acid, coral, cyan, and violet system remains. New controls use semantic buttons, disclosures, tabs, and selects. The site avoids nested cards and preserves strong full-width bands.

- Insights disclosures open one at a time within each theme and support keyboard activation.
- Reach plays default closed except the first; the page remains understandable without expanding anything.
- Compare controls update one coherent result panel without navigation.
- Library embeds are responsive and never shift or overflow the layout.
- All images use stable aspect ratios, lazy loading below the fold, and useful alt text.

## Acceptance Criteria

- Navigation reads `How to reach them`; influencer filters read `Creator`, `Artist`, `Athlete`, and `IP`.
- The graph validates at least 30 artists, 12 athletes, and 12 combined IP records, all with complete detail-page fields.
- Featured Bluey, KPop Demon Hunters, and other Overview culture-shaper images render without broken assets.
- Overview includes the Spotify episode embed, three expandable reach principles, a three-topic Alpha versus Z comparison, and a ten-item mixed-media shelf.
- Insight directory disclosures reveal quick-hit content and preserve full-detail links.
- Reach is materially shorter at first glance and no text is clipped at 320px, 768px, or desktop widths.
- Compare supports Gen Z, Gen X, and Boomers across at least three topics and labels interpretive material.
- Library has at least ten podcasts and seven videos, correct filter order, a featured Eclectic Polymath card, and playable Spotify/YouTube embeds.
- Automated tests, graph validation, production build, desktop browser QA, mobile browser QA, console checks, and core interaction checks pass.

