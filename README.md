# Joshua's AgencyThings

Joshua's internal agency workspace: one home for practical tools, strategy labs, living research, templates, and experiments. The repository is organized as a small monorepo, but the live AgencyThings desktop presents every project as part of one working environment.

## Live Workspace

The GitHub Pages root is the AgencyThings desktop. It launches six active worlds:

| Thing | Purpose | Destination |
| --- | --- | --- |
| Digital Task Brief Maker | Media-plan to creative-task workflow | <https://agencythings-task-brief.vercel.app> |
| Problem Wall Lab | Strategy signal, scoring, and review workspace | <https://agencythings-problem-wall.vercel.app> |
| Gen Alpha Intelligence Lab | Living research and interview environment | <https://agencythings-gen-alpha.vercel.app> |
| Memento | Cultural moments planning | <https://agencythings-memento.vercel.app> |
| Lunch & Learn Partner Desk | Partner discovery, outreach, and session planning | `tools/lunch-learn/` on GitHub Pages |
| Hydration Refresh | Daily cultural intelligence and monthly synthesis | <https://agencythings-hydration-refresh.vercel.app> |

Each app keeps its own visual language and interaction model. The desktop provides orientation and launch behavior without flattening the projects into one template.

## Repository Structure

```text
AgencyThings/
├── index.html                         # AgencyThings desktop
├── assets/                            # Hub styles, behavior, and previews
├── tools/
│   ├── digital-task-brief-maker/      # Static GitHub Pages tool
│   └── lunch-learn/                   # Static Partner Desk
└── apps/
    ├── problem-wall-lab/              # Independent Next.js/Vercel app
    ├── gen-alpha-lab/                 # Independent Next.js/Vercel app
    └── hydration-refresh/              # Independent cultural-intelligence app
```

## Local Hub Preview

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>. The static tools run under the same local server, while the independent apps launch their Vercel deployments.

### Lunch & Learn Partner Desk

A contained workspace for deciding who should join the agency next, getting outreach moving, and keeping the full Lunch & Learn program visible.

**Location:** `tools/lunch-learn/`

**What it does now:**

- Cycles through partner suggestions without repeating a card until the unseen pool is exhausted.
- Provides partner-specific search links for checking recent announcements, research, and campaign activity.
- Lets Joshua ask for more, less, or none of a kind of partner and remembers those preferences locally.
- Moves organizations forward or backward through a five-stage outreach pipeline.
- Shows a navigable monthly calendar, a completed-session archive, days since the last session, and days until the next.
- Renders first outreach, follow-up, confirmation, and internal announcement templates as copy-ready emails tailored to the selected partner.
- Keeps a searchable directory with direct routes back into research and the pipeline.

**Hosted use:**

The GitHub Pages workflow publishes the Partner Desk at `/tools/lunch-learn/` without replacing the AgencyThings desktop or Digital Task Brief Maker.

**Run locally:**

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173/tools/lunch-learn/>.

## Projects

### Hydration Refresh

A standalone editorial intelligence desk for discovering cultural signals, saving sourced stories, building recurring storylines, and shaping the monthly Gatorade newsletter.

**Location:** `apps/hydration-refresh/`

**Vercel project root:**

```text
apps/hydration-refresh
```

Production: <https://agencythings-hydration-refresh.vercel.app>

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

**Vercel project root:**

```text
apps/gen-alpha-lab
```

Production: <https://agencythings-gen-alpha.vercel.app>

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

**Vercel project root:**

```text
apps/problem-wall-lab
```

Production: <https://agencythings-problem-wall.vercel.app>

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

The GitHub Pages workflow publishes the AgencyThings desktop at the site root and preserves this tool at `/tools/digital-task-brief-maker/`.

**Run locally:**

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173/tools/digital-task-brief-maker/>.

**Why local-first:** media plans can be sensitive, and the MVP processes uploads in the browser without a backend database.

## Roadmap

See `docs/digital-task-brief-maker-plan.md` for the recommended product plan, data model, and next phases.
