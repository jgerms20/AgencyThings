# Gen Alpha Editorial Briefing Redesign

## Purpose

The Gen Alpha Intelligence Lab should feel like a concise internal cultural briefing, not a research dashboard or an exhaustive report pasted into a webpage. Every route leads with a clear conclusion, shows only the minimum context needed to understand it, and keeps supporting evidence one layer deeper.

The redesign should reduce visible homepage copy by roughly 80 percent while preserving the existing research records, finding relationships, and direct source links.

## Editorial Rule

Every page must answer three questions in this order:

1. **What is the insight?** A short, bold statement visible without reading supporting copy.
2. **Why does it matter?** One concise interpretation, usually no more than two sentences.
3. **Where is the proof?** A direct path to the relevant finding or source, never a wall of citations in the primary reading flow.

Insight blocks must be visually distinct. Contrast comes from full-width color bands, typography scale, photography, and whitespace rather than dense card grids, gradients, decorative effects, or repeated metadata.

## Information Architecture

The persistent header contains only:

- **Gen Alpha Intelligence Lab**
- **Overview**
- **People**
- **Library**
- Theme toggle

The seven `How they...` links are removed from the header. Existing topic and finding URLs remain valid for deep links, but the primary navigation no longer exposes every taxonomy item at once.

Primary routes:

- `/` is the insight-led editorial overview.
- `/people` explains who shapes Gen Alpha culture and what each creator represents.
- `/library` houses the complete source library and Make, Think, Learn filters.
- Existing `/findings/[findingId]` and `/topics/[topicId]` routes remain available as evidence-rich detail pages.

## Homepage

The homepage is a short briefing with five sections.

### 1. Compact Opening

The opening uses a restrained masthead rather than a giant marketing hero. It contains:

- `Gen Alpha, in four truths.` as the primary headline
- One sentence establishing the cohort as the first childhood shaped by conversational AI, participatory gaming, creator media, and managed digital life
- `Explore the evidence` linking to `/library`

There are no finding cards, image stacks, horizontal scrollers, or seven-link navigation in the first viewport.

### 2. Four Consolidated Insights

The seven current lenses are synthesized into four editorial truths:

1. **AI is a default interface.** Learning, search, discovery, and making increasingly begin with a system that answers back.
2. **Play is social and creative.** Roblox, Minecraft, and Fortnite are places to gather, make, perform, and solve problems together.
3. **Video is utility and culture.** Video entertains, explains, teaches, sets language, and supplies social reference points.
4. **Influence moves through people and households.** Creators spark desire and belonging, while parents still control access, permission, and purchase.

Each insight is a full-width band with one headline, one short interpretation, and one deep-link action. The bands use distinct, high-contrast palettes and do not repeat evidence lists on the homepage.

### 3. People Preview

A concise portrait strip introduces the creator ecosystem with six people:

- **MrBeast**: spectacle, scale, generosity, and challenge formats
- **IShowSpeed**: live spontaneity, reaction, global fandom, and participatory chaos
- **Kai Cenat**: chat-led community, eventized streaming, and internet-native celebrity
- **Aphmau**: Minecraft roleplay, serialized gaming stories, and younger audience familiarity
- **Salish Matter**: challenge and lifestyle content, peer aspiration, and youth commerce
- **Ms. Rachel**: early-learning video, parent trust, repetition, and the younger end of Gen Alpha

The homepage shows portraits, names, and a single phrase. `See who shapes the culture` links to `/people`. Creator portraits use real, recognizable public or official profile photography cached locally with source attribution.

### 4. Owned Point Of View

Joshua's Gen Alpha podcast is presented as one compact editorial recommendation with title, one-sentence description, and a Spotify action. The existing three-item takeaway list is removed from the homepage.

### 5. Library Invitation

The page ends with a single high-contrast invitation to open the research library. The full resource list never renders on the homepage.

## People Page

The People page is insight-led rather than a directory.

- Opening insight: `Creators are not just media. They are formats for behavior.`
- A concise synthesis explains that Gen Alpha copies creator mechanics such as challenges, reactions, live chat, roleplay, tutorials, product rituals, and audience participation.
- Six profiles use alternating editorial layouts rather than identical cards.
- Every profile contains a portrait, name, platform link, one bold cultural role, and no more than two short supporting sentences.
- A final `What this adds up to` band pulls out three implications: participation beats passive viewing, personality carries across formats, and influence still travels through household permission.

The page deliberately includes women and spans early childhood, gaming, streaming, lifestyle, and mass entertainment.

## Library Page

The complete research library moves to `/library`.

- Opening insight: `Start with the conclusion. Open the source when you need the proof.`
- Three short research takeaways appear before the resource controls.
- Make, Think, Learn filters retain their exact existing behavior.
- Format groups remain Articles, Podcasts, Books, and YouTube.
- Resource rows retain source, source class, topic tags, use modes, and direct external links.
- Filtering works on individual records before format grouping.

The library is intentionally denser than the rest of the site, but it remains a single-purpose route with clear spacing and no repeated homepage sections.

## Finding And Topic Pages

Existing detail routes remain evidence-rich, but their hierarchy changes:

- A bold insight statement is the first content after the header.
- `What we know`, `Why it matters`, and `Evidence` become visually separate sections.
- Gen Z comparison appears only when it sharpens the insight.
- Long explanatory paragraphs are shortened into one or two sentences.
- Evidence records remain direct links and do not compete with the main conclusion.
- Every page uses its own accent color or image treatment within the shared design system so routes feel bespoke without becoming visually unrelated.

## Visual System

- Dark mode remains the default, with a functioning light mode.
- The canvas uses black, off-white, acid green, cyan, coral, and selective violet as distinct editorial accents.
- No gradients, horizontal scrollers, decorative blobs, nested cards, or floating dashboard panels.
- Homepage body copy is capped at a comfortable reading width and kept deliberately sparse.
- Display type is bold but controlled; no headline should require more than three lines on desktop.
- Creator portraits use consistent aspect ratios and strong crops without putting the whole experience inside cards.
- Motion is limited to subtle hover lift and opacity changes, with reduced-motion support.
- Desktop and 390px mobile layouts must have no horizontal overflow.

## Content Limits

- Homepage headline: one.
- Homepage body copy: approximately 350 words or fewer, excluding navigation and creator names.
- Insight interpretation: two sentences maximum.
- Creator preview: one phrase per person.
- Creator detail: two short sentences maximum per profile.
- No section exists only to explain the site's structure or features.

## Testing And Verification

1. Header exposes only Overview, People, Library, and theme control.
2. Homepage contains four consolidated insights and does not render the seven-lens map, topic-card scroller, editorial finding stack, or full library.
3. `/people` includes all six creator profiles, at least three women, real portrait assets, and working platform links.
4. `/library` contains all source groups and exact Make, Think, Learn filtering.
5. Existing topic and finding routes continue to resolve and lead with an insight.
6. Dark and light themes continue to work on every primary route.
7. Full Vitest suite and Next production build pass.
8. Browser QA covers Overview, People, Library filter behavior, one finding route, one topic route, and 390px mobile overflow.
9. Final screenshots are inspected against the approved editorial direction for hierarchy, copy density, contrast, portrait framing, and responsive behavior.

