# Gen Alpha Findings Field Guide Design

## Purpose

Gen Alpha Intelligence Lab becomes Joshua's place to learn what matters about Gen Alpha. The primary experience is a cultural field guide that synthesizes findings and makes the supporting evidence easy to inspect. It is not a research-operations dashboard and does not organize the audience by age bands.

## Editorial Model

The site distinguishes three layers:

1. **Finding**: a clear statement about Gen Alpha behavior or culture.
2. **Interpretation**: why the finding matters and how it differs from Gen Z when the contrast is useful.
3. **Support**: direct links to reports, studies, journalism, videos, podcasts, and interviews behind the claim.

The existing signal map remains useful content, but it is re-expressed as an editorial overview called `How their world fits together`. Confidence labels and source counts move into quiet metadata rather than leading the visual hierarchy.

## Primary Areas

The main navigation and finding groups are:

- **Connect**: friendship, family, communities, parasocial relationships, and communication norms
- **Media**: YouTube, streaming, short video, shows, music, creators, discovery, and attention
- **Influence**: parents, peers, creators, algorithms, fandoms, and brands
- **Time**: daily routines, free time, multitasking, offline life, and managed screen access
- **Learn**: school, tutorials, search, AI assistance, games, and informal skill-building
- **Play & Create**: Roblox, Minecraft, Fortnite, identity, remixing, making, and participatory culture
- **AI**: ambient assistants, entertainment discovery, trust, safety, and the difference between novelty and infrastructure

These areas are behavioral lenses, not mutually exclusive database categories. A finding may appear in more than one lens while retaining one canonical source record.

## Homepage

The first viewport is a calm editorial read:

- Gen Alpha Intelligence Lab identity
- A current framing statement about the first AI-native childhood
- Three featured findings, not operational metrics
- A visual `How their world fits together` map
- One prominent `Upload interview` action

Below the first viewport:

- Topic navigation
- Finding stories with summaries and supporting links
- Featured owned media
- Sourcebook
- Interview archive and upload intake

The visible `Add source`, research queue, record status filters, demo-mode chip, and intake-as-dashboard treatment are removed from the primary experience.

## Owned Media And Interviews

Joshua's podcast episode is featured as owned editorial content:

- `#093 Gen Alpha: AI, Gaming, and the First Fully Digital Childhood`
- Spotify URL: `https://open.spotify.com/episode/7l1peATWasIYA07RvqKgwn`
- Status: `To listen / synthesize`

The episode card includes a Spotify launch action and a place for Joshua's later notes. It is not presented as independently verified evidence until notes or transcript support are added.

`Upload interview` remains the only prominent contribution action. The form accepts interview title, participant alias, relationship/context, notes or transcript, and optional audio/video/document file. Public-facing names are not required. Uploaded interviews appear in the interview archive and may later be attached to findings.

## Research Sourcebook

The sourcebook supports the findings without dominating the homepage. It includes:

- Existing high-quality sources already seeded in the project
- Large-scale consumer research from PwC, Nielsen, GWI, Morning Consult, Common Sense Media, and comparable primary reports
- Peer-reviewed or systematic research on learning, digital behavior, parental mediation, AI literacy, and online safety
- Relevant New York Times coverage when a stable link is available
- YouTube videos or documentaries with clear publisher, creator, date, and relevance notes
- Reddit and community conversation as qualitative context, labeled separately from representative research
- Joshua's podcast and interviews as owned qualitative material

Every source record carries a source class: `primary research`, `peer reviewed`, `journalism`, `video`, `community`, or `owned`. Findings show support links grouped by source class.

## Data And Persistence

The existing `ResearchRecord` model is extended rather than discarded. Findings receive stable IDs and arrays of supporting record IDs. Topic lenses reference finding IDs. Custom interview records continue to use the existing localStorage/Supabase-ready intake path, with storage errors handled safely.

The source-management API remains available for future internal use but is not exposed as an `Add source` command in the main navigation.

## Visual Direction

The redesign should feel like a contemporary cultural report:

- Open white editorial canvas
- Black typography with acid green, warm yellow, and selective image color
- Fewer simultaneous panels
- Full-width story bands and evidence footnotes
- Real cultural imagery that supports inspection
- Limited cards reserved for findings, media, and interview records
- No operational queue in the hero
- No nested cards, decorative gradients, or dashboard chrome

## Verification

Completion requires:

1. Connect, Media, Influence, Time, Learn, Play & Create, and AI are all represented by at least one substantive finding.
2. Every published finding links to at least two supporting records, including one source stronger than community conversation.
3. The Spotify episode opens correctly and is labeled as owned/to-synthesize material.
4. Upload Interview adds a record and persists under the available storage mode.
5. There is no visible `Add source` action or research queue on the primary experience.
6. Existing API behavior and record utilities remain tested.
7. Desktop and 390px mobile layouts have no overflow or incoherent overlap.

