# Hydration Refresh Design

## Purpose

Hydration Refresh is a standalone internal cultural-intelligence workspace for building a monthly Gatorade-facing newsletter from a continuous stream of sourced observations. It is a separate product from Gen Alpha and every other Agency Things app. Agency Things only provides the launch link.

## Editorial Model

The July 2026 newsletter establishes the recurring monthly structure:

1. Monthly theme and Gatorade learning
2. Trends to Watch
3. Creative That Matters
4. Culture Corner
5. Monthly Pick with prediction confidence
6. Provocation

Every candidate story preserves facts and interpretation separately. The stable editorial unit is `what happened -> why it matters -> optional Gatorade implication`. Daily intake should remain culturally broad; Gatorade relevance is a score and editorial field, not an ingestion filter.

## Product Structure

The app has four primary views:

- **Today:** fresh, source-attributed signals with filters, save actions, source coverage, and an on-demand `Refresh all sources` command.
- **Saved:** a persistent reading list with notes, status, and the ability to remove or assign stories.
- **Storylines:** user-created clusters that collect related stories and reveal patterns over time.
- **Monthly:** an editable issue builder using the six newsletter modules above, including theme, learning, section assignments, prediction confidence, and provocation.

The first release prioritizes a complete Today-to-Saved-to-Storyline-to-Monthly workflow. Daily email delivery and premium social connectors remain optional integrations rather than blockers.

## Data Model

`Story` stores: id, headline, dek, source name, source URL, source kind, canonical URL, author, published/observed timestamps, image URL, excerpt, transcript excerpt, cultural domain, strategic themes, entities, what happened, why it matters, Gatorade implication, provenance, and freshness status.

`SavedStory` stores: story id, saved timestamp, notes, review status, monthly selection, and storyline ids.

`Storyline` stores: id, title, thesis, color, created/updated timestamps, and story ids.

`MonthlyIssue` stores: month, theme, learning, section story ids, prediction, confidence, why watching, recurring patterns, contradictions, opportunities, and provocation.

`RefreshRun` stores: id, start/end timestamps, connector statuses, warnings, added count, duplicate count, and stale-source indicators.

## Source Architecture

Connectors normalize external metadata into `Story` records through one interface. Version one uses sources that can operate without private credentials:

- Curated RSS/Atom publication feeds and Google News RSS discovery
- Crossref research metadata
- Direct podcast RSS feeds and publisher-provided transcript links
- Public event/calendar feeds where available
- Manual source URL intake

Reddit and X are first-class connector statuses, but official authenticated APIs are required for dependable production ingestion. The UI must never label substitute content as Reddit or X. When credentials are absent, the connector explains that it is unavailable and the rest of the refresh succeeds. No connector bypasses paywalls or stores unlicensed full text.

Manual refresh and scheduled refresh call the same refresh service. Connector failures are isolated, last-good results remain visible, and source coverage is shown honestly.

## Persistence

The browser persists saved stories, notes, storylines, monthly drafts, and the last-good feed in versioned local storage so the app works immediately and survives reloads. A Supabase schema and repository boundary support cross-device persistence when environment variables are configured, without changing the UI contract.

## Visual System

The accepted concept is `docs/concepts/hydration-refresh-primary-screen.png`, derived from the supplied July newsletter.

- True black, true white, and electric orange; no gradients
- Condensed uppercase display typography paired with a readable sans serif
- Open editorial lists and rails rather than rounded dashboard cards
- Thin orange rules, sharp geometry, direct photography, and compact utility controls
- Desktop-first editorial workspace with a coherent mobile stack
- Dark and light themes, with dark as the default

The first viewport includes the product navigation, `What culture is telling us today.`, `Refresh all sources`, connector status, filters, the story feed, and the monthly-building rail.

## Errors And Trust

- Refreshes return partial success with connector-level warnings.
- Duplicate stories are merged by canonical URL and normalized title.
- All stories link to their original source and display source type and time.
- Stale results are labeled rather than silently presented as current.
- Missing credentials do not break the rest of the app.
- User notes and saved state are never discarded when a refresh runs.

## Acceptance

- A user can refresh sources without waiting for the next schedule.
- A user can save a story, reload, and still find it in Saved.
- A user can add a saved story to a storyline and then to a monthly section.
- The monthly builder reflects the supplied newsletter structure.
- Every externally sourced item has a working source link and provenance.
- The app is a separate deployable site and appears as a sixth Agency Things hub project.
- Desktop and mobile layouts have no clipping, overflow, or inert core controls.

