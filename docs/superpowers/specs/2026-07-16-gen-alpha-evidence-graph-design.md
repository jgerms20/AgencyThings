# Gen Alpha Evidence Graph Expansion

## Goal

Turn the Gen Alpha Intelligence Lab from a concise editorial briefing into a deep, source-traceable internal research and strategy system without returning to an undifferentiated long page.

The expansion must answer five practical questions:

1. What are the most important things to understand about Gen Alpha?
2. What evidence supports each conclusion, and what are its limits?
3. Who and what shapes their culture?
4. Where do they spend time, online and offline?
5. How should an agency reach them responsibly, and how is this different from Gen Z?

## Information Architecture

Primary navigation becomes:

- **Overview**: a concise synthesis of the four themes, featured culture shapers, priority spaces, the podcast, and current strategy implications.
- **Insights**: forty evidence-backed insights, grouped into four themes with ten insights each.
- **Influencers**: creators, artists, athletes, screen properties, and franchises that shape culture.
- **Spaces**: fifty digital and physical environments where time, identity, media, play, and learning happen.
- **Reach Them**: an agency strategy layer that turns evidence into responsible ways to participate.
- **Compare**: an evidence-aware Gen Alpha and Gen Z comparison across ten dimensions.
- **Library**: source records by format, with extracted evidence and related insights.

The mobile header uses a menu button rather than a horizontally scrolling navigation strip. Every destination remains keyboard accessible.

## Canonical Evidence Graph

The app will use one canonical content model:

`Theme -> Insight -> Evidence item -> Source`

Creators, spaces, strategy plays, and comparison dimensions reference insight and source IDs from the same graph. The canonical content layer replaces the duplicated data in `editorial.ts` and `findings.ts`; legacy routes use thin adapters until they are migrated to direct graph queries.

### Source

Each source includes:

- stable ID, title, organization, author when available, URL, format, and publication date
- source class: primary research, peer reviewed, policy, platform data, industry research, journalism, owned synthesis, or community signal
- methodology summary
- population, age range, geography, sample size, and fieldwork date when available
- confidence and evidence-use limitations
- format-specific metadata such as YouTube ID or podcast embed URL

### Evidence Item

Each evidence item includes:

- stable ID and source ID
- exact metric or concise extracted claim
- locator such as section, page, figure, or paragraph description
- evidence type: observed, self-reported, qualitative, forecast, platform-wide metric, or editorial inference
- population, age, geography, and time period
- methodology and limitation text
- related insight IDs

Short excerpts are used only when necessary and remain within quotation limits. Most evidence is paraphrased.

### Insight

Each insight includes:

- stable ID, theme ID, sequence, title, thesis, and concise interpretation
- two or more evidence items from at least two distinct sources
- at least one source that is not community material
- age and geography scope
- confidence level and a plain-language reason for that confidence
- nuance or counterpoint
- Gen Z comparison where defensible
- responsible agency implication
- related creator and space IDs
- cross-cutting tags, including AI where relevant

The content validator rejects duplicate IDs, orphan references, unsupported insight claims, and insights without qualifying evidence.

## Four Themes And Forty Insights

AI is a cross-cutting lens inside the themes, not a standalone theme.

### Play & Belonging

1. Play is social infrastructure.
2. Playing and making increasingly share the same interface.
3. Friendship travels between games, chat, video, and real life.
4. Avatars are rehearsal spaces for identity.
5. Small crews matter more than public follower counts.
6. Competition is also performance and storytelling.
7. Digital status is built through fluency, objects, and contribution.
8. Family co-play remains part of the social system.
9. Offline play is rebounding rather than disappearing.
10. Safety boundaries are part of the play experience.

### Media & Influence

1. Video is the default entertainment and explanation layer.
2. Short-form changes the shape of attention, not only its duration.
3. Creators act as behavioral templates.
4. Influence is negotiated inside the household.
5. Discovery and commerce increasingly share the same surface.
6. Culture moves through repeatable formats more than fixed channels.
7. Entertainment properties travel through music, games, products, and memes.
8. Co-viewing still creates household-scale influence.
9. AI is entering entertainment search and recommendation.
10. Reach, persuasion, and safety risk coexist in the same feeds.

### Time & Routines

1. Total screen time hides a major shift in what screens are for.
2. Personal device access begins before personal independence.
3. YouTube is embedded in the daily household rhythm.
4. Parents manage context and rules, not only minutes.
5. Screens fill practical family needs as well as entertainment needs.
6. Digital routines change quickly with age.
7. Nighttime use is part of the real media day.
8. Online and offline activities coexist rather than cancel each other out.
9. Personal devices widen the private media day.
10. Income and household context shape access and use.

### Learning & Becoming

1. Learning is assembled on demand across multiple environments.
2. Creation games are perceived as places to learn real skills.
3. AI is already part of homework and explanation.
4. AI use extends beyond schoolwork into discovery, creativity, and support.
5. Safety guidance is lagging behind AI adoption.
6. Verification is becoming a core literacy.
7. Technology matters for what it enables, not for the hardware itself.
8. Creative identity grows through iteration and remix.
9. Commercial fluency begins as a form of practical learning.
10. Becoming is multimodal, self-directed, and socially coached.

## Overview Experience

The overview remains concise. It does not render all forty insights.

Each theme tab shows:

- one dominant insight and one sourced data point
- four supporting insight headlines
- an evidence count and clear link to all ten theme insights
- a distinct visual composition and accent color

Play & Belonging remains first. Learning & Becoming replaces AI & Agency. The introductory copy describes AI as a cross-cutting condition.

The podcast label becomes **Listen to understand them more**. It is not described as Joshua's point of view.

## Insight Directory And Detail

The Insights page provides theme navigation and forty scannable insights. Each theme gets its own full-width band and a clear reading sequence.

`/insights/[insightId]` contains:

- the conclusion and interpretation
- a lead metric or qualitative evidence feature
- an evidence ledger with source, population, methodology, and limitations
- nuance and competing evidence
- Gen Z context when available
- related spaces and culture shapers
- an agency implication that links to Reach Them

Every source link is direct. Search-result links are prohibited.

## Influencers Become Culture Shapers

The navigation label remains **Influencers**, while the page explains that influence comes from people, properties, and cultural systems.

The directory supports filters for:

- type: creator, artist, athlete, screen/IP, or franchise
- audience age
- topic or interest
- primary platform
- format
- audience segment

The existing creator roster remains and is expanded with music, movie, television, sports, and franchise influence. The roster must include women and girl-focused culture across all relevant categories.

### Profile Depth

Each profile includes:

- concise background and current role in culture
- content topics and recurring formats
- audience center, broader audience, age context, and confidence
- why the profile matters and the mechanism of influence
- defining moments, properties, collaborations, or extensions
- related themes and spaces
- source links and evidence notes
- one or more privacy-enhanced, lazy-loaded video embeds when embeddable media exists
- an official destination link

### Editorial Indicator Rubric

Indicators remain editorial tools, not real-time measurement.

- **Reach**: public audience footprint across relevant platforms and mainstream recognition.
- **Participation**: the degree to which audiences react, imitate, remix, play, chat, submit, or shape the format.
- **Commercial pull**: evidence that influence travels into products, licensing, tickets, subscriptions, in-game spending, or household requests.
- **Audience center**: the best-supported age and audience concentration, with an explicit confidence level.

Each indicator stores:

- a tier from 1 to 4
- the rubric definition for that tier
- a profile-specific rationale
- supporting source IDs

An info icon beside each label reveals the general rubric and profile-specific rationale on hover and keyboard focus. The UI never presents a score without this explanation.

## Fifty Spaces

Spaces include digital platforms, specific game ecosystems, media services, learning and making tools, and offline environments. The page supports filters by category, environment, and audience age.

### Games & Participatory Worlds

1. Roblox
2. Minecraft
3. Fortnite
4. Nintendo Switch
5. Mario
6. Pokemon
7. Toca Boca World
8. Brawl Stars
9. EA Sports FC
10. NBA 2K
11. The Sims
12. Rec Room
13. Gorilla Tag
14. Among Us
15. Geometry Dash

### Video, Streaming & Live Media

16. YouTube
17. YouTube Kids
18. YouTube Shorts
19. TikTok
20. Twitch
21. Netflix
22. Disney+
23. Prime Video
24. Max
25. Crunchyroll

### Social, Messaging & Private Networks

26. Snapchat
27. Discord
28. WhatsApp
29. Instagram
30. iMessage and FaceTime
31. Messenger Kids
32. Reddit
33. Pinterest

### Music & Audio

34. Spotify
35. Apple Music
36. YouTube Music
37. Amazon Music
38. Podcasts and audiobooks

### Learning, Search & Making

39. Google Search
40. ChatGPT
41. CapCut
42. Canva
43. Scratch
44. Duolingo
45. Khan Academy
46. Google Classroom and school learning systems

### Offline Culture

47. School
48. After-school sports and clubs
49. Cinemas and live entertainment
50. Home and family routines

Each space replaces the grammatically weak **What it enables** field with:

- What it is
- Why they go
- What happens there
- Who is there
- What the evidence says
- Why it matters for strategy
- Safety, privacy, or age caveat

Every space contains at least one qualifying source or is visibly labeled as an editorial watchlist item.

## Reach Them

`/reach-them` is the responsible agency strategy layer. It does not encourage covert or manipulative child targeting.

The page organizes strategy around eight plays:

1. Give them something to make or shape.
2. Build a repeatable format, not a one-off message.
3. Design for the child and the enabling adult.
4. Enter an existing ritual with useful value.
5. Create a physical-digital loop.
6. Use creators for format fluency, not borrowed fame alone.
7. Make safety, privacy, and transparency visible product qualities.
8. Measure participation and usefulness, not reach alone.

Each play includes:

- when it is appropriate
- audience and age context
- evidence-backed rationale
- relevant spaces and culture shapers
- useful formats
- failure modes and ethical constraints
- linked insight and source IDs

## Compare Generations

`/compare` compares Gen Alpha with Gen Z across ten dimensions:

1. Formative technology
2. Primary social behavior
3. Media discovery
4. Play and creation
5. Creator relationships
6. Learning and search
7. Commerce and household influence
8. AI relationship
9. Family mediation
10. Privacy and safety environment

Every comparison is labeled as one of:

- age-matched observed evidence
- current cohort snapshot
- directional interpretation

The interface shows source year, age range, geography, and methodology caveat. It does not present differences caused only by age as proof of a generational trait.

## Library And Source Pages

Library filters remain All, Reports, Articles, Books, Podcasts, and Videos.

Each source preview adds:

- population and methodology summary
- extracted evidence count
- related themes
- evidence-strength label

`/library/[sourceId]` displays source metadata, every extracted evidence item, related insights, and the direct source link. YouTube records may embed privacy-enhanced video. Other records link directly.

## Visual Direction

Keep the current black, off-white, acid, coral, cyan, and violet editorial language while introducing more deliberate data visualization.

- Use one dominant statistic or visual argument per insight cluster.
- Use full-width bands, editorial tables, comparison rails, and evidence ledgers instead of a large card wall.
- Use portraits, property artwork with documented provenance, and embedded video where they help inspect the subject.
- Avoid gradients, decorative blobs, nested cards, horizontal scrolling, and tiny data text.
- Keep hero-scale type only in true page openings.
- Preserve light and dark themes.
- At 320px and wider, no text, navigation, filter, tooltip, embed, table, or image may overflow its parent.

## Data Integrity

Content validation must enforce:

- exactly four themes and ten insights per theme
- unique IDs across every entity
- at least two evidence items and two distinct sources per insight
- no orphan source, evidence, insight, creator, space, strategy, or comparison references
- every metric has population, age, geography, time period, and limitation fields, using explicit unknown values when unavailable
- every creator indicator has a valid tier, rationale, rubric definition, and source reference
- exactly fifty spaces
- every comparison dimension has both cohorts plus a comparison-class label
- every strategy play references evidence and an ethical constraint

## Verification

### Automated

- Data-model and validator tests cover every integrity rule.
- Component tests cover theme tabs, insight drill-down, influencer filters and tooltips, multiple video embeds, space filters, strategy plays, comparison dimensions, source detail, and mobile navigation.
- The Next.js production build generates all static routes successfully.
- `git diff --check` passes.

### Browser

Browser QA covers desktop, tablet, 390px mobile, and 320px mobile.

- all navigation destinations and mobile menu behavior
- theme switching and all forty insight links
- evidence-source navigation
- influencer filtering, indicator explanations, and embedded videos
- fifty-space filtering and source links
- Reach Them evidence links
- Compare dimension switching and caveat visibility
- Library filters and source detail pages
- light and dark themes
- image and iframe loading
- keyboard focus, tooltip access, console errors, and horizontal overflow

### Production

- PR checks pass.
- The change is merged to `main`.
- The stable Vercel deployment returns successful responses for every primary route and representative dynamic routes.
- Production browser QA confirms the deployed experience matches the verified local build.

## Completion Definition

The goal is complete only when all forty insights, fifty spaces, culture-shaper depth, scoring explanations, Reach Them, Compare, evidence drill-down, podcast copy change, responsive behavior, automated checks, and production checks are present and verified. A smaller compatible subset does not satisfy the objective.
