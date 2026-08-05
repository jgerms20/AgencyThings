# Digital Task Brief Placement Decks Design

## Purpose

Turn an uploaded media plan into an editable, placement-level creative task brief whose PowerPoint structure follows the supplied Lower Sugar master: title, optional timing, channel dividers, one slide per placement, optional appendix, and closing slide.

## Acceptance Fixtures

- Workbook: `Copy of 2026 Inventory Sheet - Lower Sugar (1).xlsx`
- Reference deck: `[INT MASTER] Gatorade_Lower_Sugar_Digital_Task_Brief.pptx`
- The reference deck supplies the hierarchy and slide roles. Its existing off-canvas objects on slides 11 and 16 are not reusable content frames.

## Upload And Table Editing

The raw paste textarea becomes a table workspace. A plan contains one or more named tables. Users can add, rename, duplicate, or remove a table; add or remove rows; and edit cells directly. Spreadsheet sheets import as named tables. Paste remains available as a compact action that parses rows into the active table.

The canonical columns are Bucket, Channel, Partner, Asset, Asset Format, Specs, Placement, Quantity, and Notes. The existing parser continues to receive tab-delimited text generated from the tables.

## Review

Review groups remain organized by channel, but every channel receives a stable visual accent and a distinct header band. Placement cards sit inside their channel section. Duration strings such as `:15s / :30s` produce separate duration variants so both specification sets remain visible and reach the deck.

## Sources And Images

Every placement source package shows:

- Official specification links that are stored URLs, not generated search pages.
- Duration-specific spec blocks when multiple durations are present.
- Up to three attributed image candidates with preview, source label, and source URL.
- One selected candidate, a user-supplied URL, or an explicit no-image state.

Known dead URLs are removed. Pinterest uses `https://help.pinterest.com/en/business/article/pinterest-product-specs`. Generic Google Image links are not presented as sourced examples. When no verified candidate exists, the UI says so instead of fabricating one.

## Template-First Customization

Step 4 begins with PowerPoint template import. After import, the UI shows the detected file and template role summary. Campaign fields are secondary and expandable: client, campaign, campaign date, and maximum slides. Brand-look presets are removed.

Checkboxes control timing slide, channel divider slides, closing slide, safe-zone reminders, review labels, and appendix. Divider and closing slides default on; appendix defaults off.

## Deck Planning

The default sequence is:

1. Title.
2. Optional timing/date.
3. Channel divider.
4. One placement slide for every placement in that channel.
5. Repeat divider and placement slides for remaining channels.
6. Optional appendix.
7. Closing slide.

Slide titles use the real placement name. A slide never contains multiple placements and never exposes generator labels such as `Slide 1: TVC` or `Audio 1/3`.

Each placement slide contains specs, copy requirements/restrictions, selected reference imagery, source attribution, and notes. External sources belong in speaker notes where supported and in the JSON export; a text-only sources slide appears only when appendix is enabled.

## Template Fidelity Boundary

The browser must preserve imported template bytes and analyze slide roles. For this iteration, the app uses the reference deck hierarchy to plan output and applies the imported theme/template profile to generated slides. Exact arbitrary-template slide cloning is accepted only after a generated deck is rendered and compared against the supplied reference. If fidelity cannot be proven in the static browser exporter, the UI must describe the limitation accurately rather than claiming an exact clone.

## Verification

- Unit tests cover table operations, duration expansion, source URL validity contracts, image selection, and deck sequence.
- The Lower Sugar workbook produces one placement slide per extracted group.
- The source screen contains no Google Image search links and no known 404 Pinterest URL.
- Browser QA covers table editing, channel review, source selection, template-first customization, and export.
- A PowerPoint export is opened, rendered, and checked for overflow, placement density, imagery, divider sequence, and closing slide before deployment.

