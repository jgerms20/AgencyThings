# Gen Alpha Intelligence Depth Expansion

## Goal

Expand the simplified Gen Alpha briefing into a deeper internal intelligence system without returning to the previous dense, undifferentiated long page.

## Information architecture

The primary navigation becomes `Overview`, `Insights`, `Influencers`, `Spaces`, and `Library`.

- **Overview** synthesizes the system. Four interactive theme tabs reveal the ten most important findings, with Play and Belonging first and AI last.
- **Insights** presents all ten evidence-backed conclusions in four thematic groups. Each conclusion links to an existing finding or topic detail page where the proof is available.
- **Influencers** replaces the vague People terminology. The homepage features five culture shapers; the directory contains thirty. Each profile opens an internal detail page with a description, audience, key moments and formats, influence rationale, and infographic-style editorial indicators.
- **Spaces** explains where Gen Alpha spends time. It covers Roblox, YouTube, Discord, TikTok, Minecraft, Fortnite, Snapchat, Instagram, Twitch, WhatsApp, Reddit, and CapCut with behavior and agency implications.
- **Library** filters by resource format: All, Reports, Articles, Books, Podcasts, and Videos. Make, Think, and Learn are removed completely.

The legacy `/people` path redirects to `/influencers`.

## Insight model

Ten insights are distributed across four tabs:

1. **Play and Belonging**: play is social and creative; friendship travels with the activity; customization is a social language.
2. **Media and Influence**: video is utility and culture; creators are behavioral templates; influence is negotiated inside households.
3. **Time and Learning**: digital time is managed childhood; learning is assembled on demand; the same spaces blur play, learning, and making.
4. **AI and Agency**: AI is becoming a normal interface; verification is becoming a core literacy.

The four tabs are navigation and synthesis, not a replacement for the evidence taxonomy in `findings.ts`.

## Influencer model

Each of thirty profiles includes:

- stable slug and display name
- role and influence category
- local or reliable portrait
- concise description and influence rationale
- primary platforms and likely audience
- three key moments, franchises, or repeatable formats
- four compact editorial indicators such as reach tier, participation level, commercial pull, and audience center
- official profile and source links

The featured profiles also include a curated official video. Video is embedded responsively, uses privacy-enhanced YouTube playback, and loads lazily so the page demonstrates the creator's format without becoming a feed.

The data is editorial intelligence, not a claim of real-time follower counts. Qualitative indicators are explicitly labeled as the lab's assessment so they remain useful without pretending to be live measurement.

## Spaces model

Each space includes what it is, how the cohort uses it, the behavior it enables, an agency implication, a primary audience band, and evidence links. The page uses high-contrast rows and compact data points rather than a repetitive card wall.

## Library model

Every external research record maps to exactly one display format. Reports and articles are separate. YouTube and other video records map to Videos. The active format tab filters records directly and presents one relevant section at a time; All shows every populated section.

Embeddable YouTube records receive an inline preview in the Videos view; every other video remains a direct source link.

## Visual direction

Keep the current black/off-white editorial system and acid, cyan, coral, and violet accents. Add depth through varied page rhythms: tabbed insight bands, a compact influencer directory, infographic profile details, and full-width space rows. Avoid gradients, nested cards, decorative pills, horizontal scrolling, and oversized copy inside compact surfaces.

Desktop and mobile must preserve a clear reading order. The five-link header may wrap into a dedicated second navigation row on small screens, but every item must remain visible without horizontal scrolling.

## Verification

- Unit tests enforce exactly ten insights, four tabs, thirty influencers, twelve spaces, unique IDs, internal detail links, and format-only library filtering.
- Component tests exercise tab selection, influencer directory/detail rendering, space rows, and all Library formats.
- The production build verifies all dynamic profile and existing finding routes.
- Browser QA covers desktop and 390px mobile, tab/filter interactions, profile navigation, theme switching, image loading, console output, and horizontal overflow.
