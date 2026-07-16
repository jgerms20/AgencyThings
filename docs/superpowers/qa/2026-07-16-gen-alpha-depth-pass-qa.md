# Gen Alpha Depth Pass QA

Date: 2026-07-16

## Automated acceptance

- `npm test`: 20 files, 197 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed; 179 static and dynamic routes generated.
- `git diff --check`: passed.

## Browser environment

- Browser: Codex in-app browser.
- Local URL: `http://127.0.0.1:3100/`.
- Desktop viewport: 1440 x 1000.
- Phone viewports: 390 x 844 and 320 x 700.
- Console: no application warnings or errors.

## Routes checked

- `/`
- `/insights`
- `/influencers`
- `/influencers/bluey`
- `/influencers/taylor-swift`
- `/influencers/coco-gauff`
- `/influencers/kpop-demon-hunters`
- `/spaces`
- `/reach-them`
- `/compare`
- `/library`

Every checked route rendered meaningful content with no application error overlay, horizontal overflow, or broken local image. Primary headlines fit at 390px and 320px.

## Interactions checked

- Overview reach disclosure opened and the three-topic comparison changed state.
- Overview Spotify episode rendered from the Eclectic Polymath episode ID.
- Insight disclosure expanded and exposed its full-detail route.
- Culture filters returned 30 artists and 12 combined IP/franchise records.
- Space environment filter returned four physical spaces.
- Related-format disclosure opened with provenance, usage caveat, and YouTube fallback link.
- Reach page exposed eight native strategy disclosures and opened a closed play.
- Compare switched to Boomers and showed the 65+ proxy, 64% figure, and Pew source.
- Compare labels the synthesized contrast as `Strategic interpretation`, not measured fact.
- Influencer videos include a direct YouTube fallback beside the privacy-enhanced embed.
- A'ja Wilson's official WNBA destination was checked without a duplicated path separator.
- Library switched among Podcasts and Videos; the featured podcast remained first and eight privacy-enhanced YouTube embeds rendered.
- The removed `What Is ChatGPT?` item no longer appears in the browsable Videos tab.
- Mobile navigation opened with all seven destinations and no horizontal overflow.

## Residual note

One illustrative space-reference YouTube embed reported unavailable inside YouTube's player in the test environment. The page's explicit external YouTube link remained visible and usable; the record is labeled as a format reference rather than usage evidence.
