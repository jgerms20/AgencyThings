# Gen Alpha Feedback Integration Design

**Date:** 2026-07-29  
**Status:** Accepted for implementation based on the user's instruction to share the plan and continue directly into the build.

## Objective

Turn the current Gen Alpha Intelligence Lab and companion rooms into a clear, credible baseline-learning system that can later support original agency thought leadership. The experience should help a colleague who knows very little about Gen Alpha get oriented quickly, distinguish evidence from interpretation, and see exactly where proprietary research should enter next.

The site must not imply that compiled public research is already a novel agency point of view.

## Product roles

### Intelligence Lab

The Lab is the working knowledge system. It should move in a deliberate order:

1. **Gen Alpha 101:** the basic orientation a new reader needs.
2. **Audience truths:** what current evidence says about the generation's lives.
3. **Marketing 101:** practices already circulating in youth marketing.
4. **Research frontier:** tensions, hunches, gaps, and questions that could become original agency work.
5. **Library:** the proof, with market, age, and evidence limitations visible.

### Gen Alpha Rooms

The rooms are the experiential companion. They make the baseline memorable by attaching findings to ordinary objects and routines. They should feel human and exploratory, while remaining explicit about sample geography, age, and the limits of a boys/girls lens.

## Core editorial principles

### Plain before profound

Lead with concrete language and recognizable situations. Replace abstract claims such as “media is dialogic” with examples such as asking an AI follow-up question, changing an avatar, remixing a video, or carrying a Roblox friendship into school the next day.

### Baseline is not breakthrough

Every major synthesis belongs to one of three stages:

- **Established:** supported by direct, credible evidence.
- **Working hunch:** a useful interpretation that needs validation.
- **Open question:** a gap that calls for proprietary research.

### U.S. first, global visible

The default presentation prioritizes U.S. evidence. U.K. and other-market evidence remains valuable but must be labeled and filterable, never silently treated as U.S. truth. Global evidence is a comparison layer, not a blended average.

### Age is part of the claim

Gen Alpha spans radically different developmental stages. Every quantitative claim must make its age range visible. Studies of 13–17-year-olds must be identified as near-age teen proxies when they include older Gen Z respondents or only the oldest edge of Gen Alpha.

### Gender is a lens, not a room assignment

The boys' and girls' rooms show observed differences in available studies; they do not define universal interests or exclude gender-diverse children. The interface must explain that most datasets still use a binary split and that this is an evidence limitation.

## Intelligence Lab changes

### 1. Overview becomes a 101-first entry

The first viewport will answer four questions immediately:

- Who counts as Gen Alpha?
- How old are they now?
- What makes this cohort different from “kids” as a general marketing category?
- Where should a new reader start?

A ten-item orientation section will cover age/life stage, digital-physical continuity, family gatekeeping, play, video, creators, school/AI, commerce, identity, and the range within the cohort. Each item uses plain language and routes to deeper evidence.

### 2. Audience truths and Marketing 101 are visibly separate

The existing Insights area remains the audience-evidence layer. The current “Ways in” surface becomes **Marketing 101**, with a clear header explaining that these are established practices to understand before attempting an original point of view.

The Lab overview will show the difference between:

- “What we know about their lives”
- “What marketers already tend to recommend”
- “What we still need to learn ourselves”

### 3. Research frontier

A new section on the Summary page will make the next phase explicit without inventing results. It will include:

- evidence inputs still to add: Backslash, Canvas8, Contagious, internal Edge work, U.S. network submissions, relevant newsletters and paid publications;
- priority hypotheses raised in the meeting;
- research gaps, especially ages roughly 8–12 and parent/child decision journeys;
- potential methods: source audit, network scan, problem-wall discussion, caregiver interviews, child-safe field research, and longitudinal updates.

The proprietary-input slots are labeled as pending and editable in future work.

### 4. Market and age evidence controls

The Library gains a market filter with **U.S.** as the initial emphasis, plus **U.K.**, **Global/multi-market**, and **All**. Source cards show market and audience scope. Existing source data receives explicit geography metadata where the source itself is already known.

Insight and summary surfaces continue linking to exact evidence. Near-age proxy language becomes visually prominent rather than buried in prose.

### 5. Humanized Gen Alpha vs. Gen Z comparison

The comparison remains directional, not a universal generational law. Each comparison will use:

- one short distinction;
- one real-life example;
- one caveat about overlap, age, or evidence strength;
- direct links to relevant insights and sources.

The copy will avoid claiming that Gen Z uses technology only for escape or that Gen Alpha has solved digital balance.

## Room changes

### 1. Scope is visible at card level

Each room insight card will expose:

- market: U.S., U.K., or multi-market;
- age range and proxy status;
- evidence status: established, emerging signal, or working hunch;
- source and direct Lab link.

### 2. A human framing note

The lens switcher will include a concise disclosure that these are composite rooms built from patterns, not portraits of every child. It will acknowledge binary data limits and point to the Lab's gender evidence notes.

### 3. Creator-to-cart journey

The strongest commerce discussion from the meeting will be represented through existing room objects rather than a disconnected marketing card:

- creator poster or TV: discovery and repeated exposure;
- phone or computer: search, comparison, wish lists, and shared carts;
- caregiver door: permission, payment, and household negotiation.

This will be framed as a working hunch and research opportunity until direct Gen Alpha evidence is added.

### 4. Copy humanization

Drawer headlines and explanations will describe moments a child or caregiver might recognize. They will avoid speaking as if a statistical average is a personality.

## Interaction and visual constraints

- Preserve the existing Lab and House visual systems.
- Preserve both room images, numbered hotspots, drawers, source links, theme controls, and responsive behavior.
- Preserve the editable Summary and its local persistence.
- Do not add fake proprietary data, fabricated quotes, or unsupported demographic claims.
- Do not add a generic marketing hero or presentation-only chrome.

## Acceptance criteria

1. A first-time reader can identify Gen Alpha's approximate cohort and current life-stage spread from the Lab opening.
2. The Lab clearly distinguishes audience evidence, existing marketing guidance, and future original research.
3. U.S., U.K., and multi-market evidence can be distinguished in the Library.
4. Teen-only evidence is visibly identified as a proxy or cohort-edge study where appropriate.
5. Gen Alpha vs. Gen Z comparison copy is concrete, qualified, and human-readable.
6. Both room lenses disclose their composite and non-universal nature.
7. Room insight cards show market, age/scope, and evidence status.
8. The creator-to-cart journey appears as a working hunch connected across room objects.
9. Existing core navigation, room switching, drawers, Summary editing, and source links still work.
10. Both apps pass their complete test and production-build suites and receive desktop/mobile browser QA.

## Risks and mitigations

- **Risk: geography metadata is inferred too broadly.** Only tag sources whose market is evident from existing titles, publishers, or current scope text; use multi-market when evidence is combined.
- **Risk: a new 101 layer repeats existing content.** Keep each fast fact short and route it to the exact deeper page.
- **Risk: Marketing 101 looks like original strategy.** Label it as a baseline and pair it with the research frontier.
- **Risk: gender rooms harden stereotypes.** Keep contradictory findings, foreground overlap, expose binary-data limitations, and describe rooms as composites.
- **Risk: proprietary placeholders look unfinished.** Present them as a deliberate research intake queue, not empty content blocks.
