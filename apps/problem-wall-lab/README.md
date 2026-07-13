# Problem Wall Lab

Internal weekly Problem Wall generator for strategy teams.

## What It Does

- Generates a weekly pool of Problem Wall candidates from source signals and client briefs.
- Scores each candidate against B.U.R.S.T.: bigger reason, unexpectedness, urgency, specificity, and solvable cause.
- Preserves the deck structure: `DETAILS`, `STRATEGIST TO REACH OUT TO`, `PROBLEM`, and `OPPORTUNITY`.
- Supports manual source intake for Reddit finds, new studies, reports, field notes, or client friction.
- Lets strategists approve/reject candidates and export deck-ready copy or workflow JSON.
- Includes a Vercel cron endpoint at `/api/weekly-refresh`.
- Runs in demo mode with seeded clients and source signals before external feeds or Supabase are configured.

## Run Locally

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Deploy On Vercel

Create a Vercel project from `jgerms20/AgencyThings` and set the root directory to:

```text
apps/problem-wall-lab
```

Vercel will pick up `vercel.json` and call `/api/weekly-refresh` every Monday at 13:00 UTC.

## Optional Environment

The app works without environment variables. Add these when you want persistence or private sources:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PROBLEM_WALL_SOURCE_FEEDS=
```

`PROBLEM_WALL_SOURCE_FEEDS` can be a comma-separated list of RSS feeds to use instead of the built-in public scan.

## Data Model

See `supabase/schema.sql` for optional hosted storage tables.
