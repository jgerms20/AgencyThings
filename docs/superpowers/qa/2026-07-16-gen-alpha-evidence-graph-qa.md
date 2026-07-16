# Gen Alpha Evidence Graph QA

Date: 2026-07-16
Branch: `codex/gen-alpha-evidence-graph`
Local target: `http://127.0.0.1:3100`

## Automated Verification

- `npm test`: 20 files, 152 tests, 0 failures using the repository's default command.
- `npm run build`: successful TypeScript and static generation; 132 pages generated.
- Static routes include `/`, `/insights`, `/influencers`, `/spaces`, `/reach-them`, `/compare`, and `/library`.
- Generated detail routes include 40 insights, 42 culture shapers, and 32 canonical sources.
- `git diff --check`: clean.

## Browser Matrix

| Viewport | Representative routes | Result |
|---|---|---|
| 1440x1000 | Overview, Insights, insight detail, Influencers, profile detail, Spaces, Reach Them, Compare, Library, source detail | Pass |
| 1024x768 | Profile detail and responsive header | Pass |
| 390x844 | Overview, mobile navigation, profile detail | Pass |
| 320x760 | Ten core and representative dynamic routes | Pass; no horizontal overflow |

The 320px audit measured document width and element bounds on `/`, `/insights`, representative insight details across all four themes, `/influencers`, `/influencers/ms-rachel`, `/spaces`, `/reach-them`, `/compare`, `/library`, and representative source details. Every route reported `scrollWidth === 320`, no out-of-bounds main-content elements, and no broken visible images. Lazy portraits loaded after their directory entered the viewport.

## Interaction Coverage

- Seven-link desktop navigation renders in the approved order with route-derived active state.
- Mobile menu opens, focuses the first link, exposes all seven destinations, closes on Escape, and returns focus to the menu button.
- Dark/light theme toggle updates the document theme and accessible label.
- Four overview insight tabs change the selected panel.
- Influencer type and audience-segment filters update the live result count.
- Space category and environment filters reduce the directory to matching environments.
- Compare dimension radios update the evidence panel.
- Indicator explanation opens on keyboard focus/click and exposes rubric, tier, and profile rationale through `aria-describedby`.
- Ms. Rachel and library media render with `youtube-nocookie.com`, descriptive titles, and lazy loading.
- Browser console review found no warnings or errors.

## Content And Route Checks

- Overview exposes four themes and links to all 40 insights.
- Insight detail exposes conclusion, evidence ledger, population, methodology, limitations, counterpoint, Gen Z context, related entities, and Reach Them link.
- Influencer directory contains 42 culture shapers across creators, artists, athletes, screen/IP, and franchises.
- Spaces directory contains exactly 50 records across six categories, with evidence-backed/watchlist labels and working profile anchors.
- Reach Them contains the exact eight strategy plays and visible privacy/safety boundaries.
- Compare contains ten dimensions with cohort scope and methodology caveats.
- Library preserves All, Reports, Articles, Books, Podcasts, and Videos and provides source detail routes.
- All 80 evidence items now carry unique claim-specific support rationales, and all 32 sources carry validated ISO publication dates.
- The canonical validator checks the enriched insight graph rendered by the UI, exact entity counts, reciprocal references, strategy links, comparison classes, and culture-shaper tier definitions.

## Repairs From Browser QA

1. Widened and reduced the desktop Compare headline treatment so `compared` no longer breaks inside a word. Rechecked at 1440px and 320px.
2. Updated the overview destination from `See all 30 influencers` to `See all 42 culture shapers`.
3. Rewrote the featured podcast summary as a neutral invitation to understand the cohort; removed the remaining `Joshua's owned synthesis` framing.
4. Narrowed evidence conclusions that exceeded the measured facts, including household integration, video and short-form use, creator translation, private access, and active creation.
5. Replaced the unrelated creation-skills evidence item with Ofcom's direct observation of children using game walkthroughs for progress, tips, and strategies.
6. Added lazy portrait loading, source publication metadata, stable space anchors, and expanded culture-shaper resolution on insight pages.

## Independent Review

- Final read-only Sol review: approved with no Critical, Important, or Minor blockers on commit `1012adaf`.
- Final acceptance rerun: 152/152 tests, 132 generated pages, clean diff check, and overflow-free 320px checks on the last corrected insight set.

## Production Gate

Pending branch publication, PR checks, merge, and stable production URL verification.
