# Digital Task Brief Maker Plan

## Goal

Build a work-tool that turns a pasted media plan into a creative-ready digital task brief. The brief should reduce the manual work of translating paid media placements into creative asks, required copy fields, specs, examples, and source links.

## Recommended product shape

Start as a **local-first web app** in this repository rather than a cloud product.

Why:

- Media plans can include client-sensitive details, so local-first avoids uploading data to third-party tools during the MVP phase.
- A browser UI is easier to use than a command-line tool when pasting rows from Excel or Google Sheets.
- The generated output can be printed to PDF, copied into a deck, or exported as JSON for later automation.
- The same structure can later become a hosted internal app if the workflow proves valuable.

## MVP workflow

1. Paste a CSV, TSV, or copied spreadsheet export from a media plan.
2. The app normalizes each row and attempts to match platform/placement text to a spec-library entry.
3. Matched placements generate brief cards containing:
   - Platform and placement name.
   - Asset type.
   - Specs to build against.
   - Pink-highlighted copy placeholders for creative teams.
   - Creative direction prompts.
   - Source links for platform spec verification.
   - Example-search prompts for finding brand or platform examples.
4. Unmatched placements are surfaced as setup gaps so the spec library can be expanded.
5. Export options include copy-to-clipboard, print/PDF, and JSON download.

## Data model

The starter spec library lives in `tools/digital-task-brief-maker/data/placements.json`.

Each placement includes:

- `platform`: publisher or platform name.
- `placement`: human-readable placement name.
- `aliases`: media-plan phrases that should match this placement.
- `assetType`: static image, video, carousel, etc.
- `objectiveFit`: strategy context for when the placement is useful.
- `specs`: build requirements or planning guidance.
- `copyFields`: labels, limits, and `XXX` placeholders for creative fill-in.
- `creativePrompts`: reminders that make the brief more useful than a raw spec sheet.
- `exampleSearches`: queries to accelerate finding current examples.
- `sourceUrls`: official or primary spec pages for final verification.

## Near-term roadmap

### Phase 1: Reliable internal MVP

- Add the top 20–30 placements used most often by the team.
- Add a QA checklist to every generated brief: spec verification, legal lines, landing URLs, trafficking naming, and version matrix.
- Add manual override controls for unmatched placements.
- Save spec-library update dates and owners.

### Phase 2: Deck-ready output

- Add branded HTML/PDF themes by client or agency team.
- Generate one page per placement and one summary matrix page.
- Add screenshot/image slots for example ads.
- Add a PowerPoint or Google Slides export path.

### Phase 3: Agent-assisted research

- Add an authenticated research agent that can check official ad-spec pages and flag changed specs.
- Add example discovery with source citations and image thumbnails.
- Require human approval before updated specs become the default library.

### Phase 4: Workflow integration

- Import planned placements from common media-plan exports.
- Connect to shared drives or project-management tickets.
- Save generated briefs by client, campaign, and date.
- Add permissions if hosted for a broader team.

## Accuracy stance

Platform specs and copy limits change often. The app is intentionally built around a versioned spec library with source URLs rather than hard-coded claims hidden in the UI. Treat generated specs as a strong starting point, then verify against linked platform pages before sending a final client or creative brief.
