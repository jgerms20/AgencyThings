# Problem Wall

Joshua's weekly problem-discovery workspace. It scans current public news, research, and community sources; turns direct-linked signals into generic problem framings; scores them with B.U.R.S.T.; and supports shortlist, notes, and weekly wrap-up.

## Workflow

- **New this week:** Only current, direct-linked source results. Total source failure produces an explicit empty state; deck examples never fill the feed.
- **Shortlist:** Keep a problem, add notes, copy the weekly readout, or download JSON.
- **Reviewed:** Completed shortlist and passed candidates.
- **Deck inspiration:** Old framing examples in a separate reference-only view.

B.U.R.S.T. scores Bigger reason, Unexpectedness, Relevancy/Urgency, Specificity, and Targeted cause. Missing valid evidence caps readiness.

## Run

```bash
pnpm install
pnpm dev
```

## Vercel

Use `apps/problem-wall-lab` as the Vercel root directory. `vercel.json` runs `/api/weekly-refresh` Mondays at `0 13 * * 1`. The browser's **Find new problems** action uses `POST` and the cron uses authenticated `GET`; both call the same runner.

Optional environment:

```text
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
```

Without Supabase the API reports `mode: "demo"` and the UI persists review state locally. See `supabase/schema.sql` for weekly-run, source, candidate, status, and notes storage.
