# AgencyThings

A repository for practical agency/work tools, templates, and experiments.

## Tools

### Digital Task Brief Maker

A browser tool for turning media-plan rows and common plan exports into a creative-ready digital task brief.

**Location:** `tools/digital-task-brief-maker/`

**What it does now:**

- Accepts pasted rows plus CSV, TSV, TXT, Excel, PDF, and PowerPoint uploads.
- Auto-matches common placements against a starter spec library.
- Shows match-confidence details, source links, image-search prompts, and safe-zone reminders.
- Exports brief text to clipboard, JSON, PowerPoint, or browser print/PDF.

**Hosted use:**

The GitHub Pages workflow publishes the tool folder directly, so the Pages URL should open the upload workflow at the site root. The visible badge should read:

```text
Current build: upload workflow - 2026-06-25
```

If Pages is set to **Deploy from a branch** instead of **GitHub Actions**, choose a branch that includes this update and choose `/ (root)`. The root page redirects to the tool folder.

**Run locally:**

```bash
python3 -m http.server 4173 --directory tools/digital-task-brief-maker
```

Then open <http://localhost:4173>.

**Why local-first:** media plans can be sensitive, and the MVP processes uploads in the browser without a backend database.

## Roadmap

See `docs/digital-task-brief-maker-plan.md` for the recommended product plan, data model, and next phases.
