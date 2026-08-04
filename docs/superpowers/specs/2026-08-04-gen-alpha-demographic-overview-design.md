# Gen Alpha Demographic Overview Design

## Goal

Make the Intelligence Lab overview answer one question quickly: **Who is Gen Alpha?**

The opening should establish hard demographic facts before asking the audience to interpret behaviors, attitudes, or marketing implications. It should feel like a concise census wall, not a generated essay or a compressed version of the entire site.

## Approaches considered

### 1. Census wall on the existing overview - selected

Lead with a small set of headline facts, then let readers expand identity, race and ethnicity, and geography detail. End with compact routes into the rest of the Lab.

- Best match for the request that the first page remain the overview.
- Preserves depth without displaying every paragraph at once.
- Keeps demographic facts distinct from psychographic interpretation.

### 2. New standalone demographics page

Keep the existing overview and add a dedicated demographics destination.

- Strong separation, but does not fix the overloaded opening.
- Adds another navigation choice before answering the most basic question.

### 3. One collapsed fact sheet

Replace the overview with a single accordion containing all demographic tables.

- Very compact, but hides the handful of facts every visitor should see immediately.
- Less presentation-ready and less visually memorable.

## Selected information architecture

### 1. Opening definition

- Headline: “Who is Gen Alpha?”
- Working definition: born 2010–2024.
- Current age range: roughly 1–16 in 2026, depending on birthday.
- Explicit caveat: generation boundaries are conventions, not an official Census category.

### 2. Four immediate facts

The first viewport should expose only four facts:

- 2010–2024 birth years used by this Lab.
- Roughly ages 1–16 in 2026.
- 59.7 million U.S. residents ages 0–14 in the July 2024 Census estimate, used as the closest clean population proxy for the 2010–2024 birth cohort at that date.
- 2.01 billion people ages 0–14 worldwide in 2024, based on World Bank estimates using UN Population Division age distributions.

### 3. U.S. demographic portrait

This is the primary section and remains expanded.

- Census sex categories: 51.1% male and 48.9% female. Copy must say this is the binary sex classification available in the population estimate, not a complete measure of gender identity.
- Race alone: White 69.4%, Black 15.7%, Asian 6.3%, two or more races 6.3%, American Indian and Alaska Native 1.9%, Native Hawaiian and Other Pacific Islander 0.4%.
- Ethnicity shown separately: 27.0% Hispanic or Latino of any race; 47.2% non-Hispanic White alone.
- Region: South 40.2%, West 23.3%, Midwest 20.8%, Northeast 15.8%.
- Largest state populations: California 6.85 million and Texas 6.29 million, together representing about 22% of the U.S. under-15 population.

Race and Hispanic origin must not be presented as mutually exclusive when they are not. Every chart carries its universe, date, and source link.

### 4. Older-teen identity lens

This section is collapsed by default and labeled “Older edge only.” It uses the 2023 national Youth Risk Behavior Survey of U.S. high-school students.

- Sexual identity: 73.3% heterosexual, 4.0% gay or lesbian, 11.4% bisexual, 4.4% questioning, 4.3% another identity, and 2.5% did not understand the question.
- Gender identity: 3.3% transgender, 2.2% questioning whether they were transgender, and 94.5% neither transgender nor questioning.

The interface must say that this is a nationally representative high-school snapshot, not a full Gen Alpha estimate and not applicable to younger children.

### 5. Global snapshot

The global section is visually and semantically separate from the U.S. portrait.

- 2.01 billion people ages 0–14 in 2024.
- Regional share of the global under-15 population: Sub-Saharan Africa 26.1%, East Asia and Pacific 21.4%, South Asia 20.8%, Middle East/North Africa/Afghanistan/Pakistan 13.0%, Europe and Central Asia 8.0%, Latin America and Caribbean 7.4%, North America 3.2%.
- No global race, ethnicity, sexual-orientation, or gender-identity rollup. Those categories are not measured consistently enough across countries to combine responsibly.

### 6. Continue into the Lab

Replace the former long homepage stack with four compact routes:

- What their days feel like → Insights.
- How generations differ → Compare.
- Who shapes culture → Influencers.
- Check the evidence → Sources.

The existing Insights, Spaces, Marketing 101, Gender lens, Compare, Summary, and source records remain available through navigation; they no longer all preview themselves on the overview.

## Comparison-page changes

Zackary Plutzer’s confidential comparison draft informs the voice of Media & attention, Play & belonging, and Learning & AI.

- Keep the current evidence class, source links, and caveats.
- Rewrite the mentality, strategic interpretation, and real-life example fields in a more recognizably human voice.
- Do not reproduce unsupported figures from the draft as established facts.
- Add a compact, collapsed “Human observations to investigate” section for physical discovery, co-creation, human-feeling platforms, and calm/ritual. Each item is labeled as an internal observation until a direct source is attached.

## Sources language

- Rename “Library” to “Sources” in navigation and visible interface copy.
- Keep the `/library` route and existing detail URLs to avoid breaking links.
- Rename “library record” actions to “source record.”

## Visual direction

The overview remains part of the existing Intelligence Lab system but becomes calmer and more legible.

- The signature element is a demographic age rail running from 2010 to 2024, with the oldest and youngest edges labeled.
- Use a compact data-led hierarchy: headline facts, short definitions, horizontal proportion bars, and restrained disclosure panels.
- Remove decorative numbering where order carries no meaning.
- Keep the established dark/light themes and responsive navigation.
- On mobile, all charts become one-column bars with labels above values; nothing requires horizontal scrolling.

## Data boundaries

- U.S. population, sex, race, ethnicity, and geography use July 1, 2024 Census Population Estimates.
- Global under-15 totals and regional distribution use World Bank 2024 indicators derived from UN Population Division age distributions.
- Sexual and gender identity use the CDC 2023 national YRBS and are labeled as high-school-only.
- The generation definition is a working convention, not an official statistical category.
- Psychographics, beliefs, platform use, and marketing implications do not appear as demographic facts.

## Testing

- Overview tests assert the four headline facts and the compact set of four onward routes.
- Tests assert that the old ten-insight list, podcast, Marketing 101 preview, and media shelf are absent from the overview.
- Detail disclosures are closed initially and expose source-linked demographic data when opened.
- Navigation tests expect “Sources” while retaining `/library` URLs.
- Compare tests assert the humanized language and the collapsed internal-observation section.
- Full Lab tests and production build remain required.
- Browser QA covers desktop and mobile overview, disclosure interaction, Sources navigation, and Compare interaction with no overflow or runtime errors.

