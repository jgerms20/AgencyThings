# AgencyThings

A repository for practical agency/work tools, templates, and experiments.

## Tools

### Digital Task Brief Maker

A local-first browser tool for turning pasted media-plan rows into a creative-ready digital task brief.

**Location:** `tools/digital-task-brief-maker/`

**What it does now:**

- Accepts pasted CSV, TSV, or spreadsheet rows from a media plan.
- Auto-matches common placements against a starter spec library.
- Generates printable brief cards with specs, copy placeholders, creative prompts, example-search starters, and source links.
- Exports brief text to clipboard, JSON, or browser print/PDF.

**Run locally:**

```bash
python3 -m http.server 4173 --directory tools/digital-task-brief-maker
```

Then open <http://localhost:4173>.

**Why local-first:** media plans can be sensitive, and the MVP does not need a backend to prove the workflow.

## Roadmap

See `docs/digital-task-brief-maker-plan.md` for the recommended product plan, data model, and next phases.
