# AgencyThings

A repository for practical agency/work tools, templates, and experiments.

## Tools

### Gen Alpha Intelligence Lab

A Vercel-ready internal agency research site for mapping Gen Alpha signals, Gen Z contrasts, source evidence, and interview uploads.

**Location:** `apps/gen-alpha-lab/`

**What it does now:**

- Opens with a polished agency insight surface and signal map.
- Tracks research records across reports, articles, podcasts, interviews, and field notes.
- Supports filters by search, type, status, and tag.
- Adds new source or interview records from a lab intake form.
- Includes a file input for transcripts, source documents, audio, or video interview files.
- Runs immediately in browser demo mode with local storage.
- Uses Supabase records and storage when Vercel environment variables are configured.

**Deploy separately on Vercel:**

Create a Vercel project from this repo and set the project root directory to:

```text
apps/gen-alpha-lab
```

This keeps the GitHub Pages root pointed at the Digital Task Brief Maker while giving the Gen Alpha lab its own URL.

**Run locally:**

```bash
cd apps/gen-alpha-lab
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Problem Wall Lab

An internal strategy tool for generating, scoring, reviewing, and exporting weekly Problem Wall candidates.

**Location:** `apps/problem-wall-lab/`

**What it does now:**

- Generates a weekly pool of Problem Wall candidates from source signals and client briefs.
- Scores each candidate against B.U.R.S.T.: bigger reason, unexpectedness, urgency, specificity, and targeted solvable cause.
- Preserves the deck structure: details, strategist contact, sharp problem statement, and `HOW COULD...` opportunity.
- Supports manual signal intake for new studies, reports, Reddit/community finds, and client friction.
- Lets strategists approve/reject candidates and export deck-ready copy or workflow JSON.
- Includes a Vercel cron endpoint for Monday weekly refreshes.

**Deploy separately on Vercel:**

Create a Vercel project from this repo and set the project root directory to:

```text
apps/problem-wall-lab
```

This gives the Problem Wall Lab its own Vercel URL while keeping the existing GitHub Pages tool and sibling apps separate.

**Run locally:**

```bash
cd apps/problem-wall-lab
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

### Digital Task Brief Maker

A browser tool for turning media-plan rows and common plan exports into a creative-ready digital task brief.

**Location:** `tools/digital-task-brief-maker/`

**What it does now:**

- Runs as a guided five-step workflow: upload, review, sources, customize, export.
- Accepts pasted rows plus CSV, TSV, TXT, Excel, PDF, and PowerPoint uploads.
- Reads inventory-style media plan workbooks as tables, skips instruction/tracking rows, and groups deliverables by campaign bucket such as TVC, POLV, Audio, Social, Programmatic, OOH, or Custom.
- Keeps partner, asset, asset format, quantity, timing, and concise spec notes visible in the review flow.
- Collapses raw plan rows into compact platform and placement groups.
- Lets the reviewer mark each group as Approved, TBD, or Needs fix.
- Builds a source package with spec links, image-search prompts, example searches, checkboxes, and reference notes.
- Customizes the task brief with client/campaign details, slides planned, slide strategy, primary/accent brand colors, safe-zone options, source appendix options, and light/dark mode.
- Exports brief text to clipboard, JSON, PowerPoint, or browser print/PDF.

**Hosted use:**

The GitHub Pages workflow publishes the tool folder directly, so the Pages URL should open the guided workflow at the site root. The visible badge should read:

```text
Current build: tool upgrades - 2026-06-29 3:49 PM PT
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
