# Gen Alpha Intelligence Lab

Internal agency research site and living lab for Gen Alpha strategy work.

Presentation surfaces:

- `/gender` separates boys, girls, and gender-diverse evidence while keeping teen proxies and evidence gaps visible.
- `/briefing` turns six headline conclusions into a print-ready talk track with exact links back to the underlying insights.

## Local Run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Vercel Setup

Deploy this app as a separate Vercel project from the `jgerms20/AgencyThings` repo.

Set the Vercel root directory to:

```text
apps/gen-alpha-lab
```

The existing GitHub Pages root can continue to serve the Digital Task Brief Maker.

## Persistence

The app works without credentials in demo mode. Added records are stored in the browser.

For shared persistent storage:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Add these Vercel environment variables:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=gen-alpha-lab
```

The service role key should only be used server-side in Vercel environment variables. Do not expose it in client code.

## Research Model

Records support:

- Reports
- Articles
- Podcasts
- Interviews
- Field notes

Each record has tags, status, confidence, a summary, optional URL, optional transcript text, and optional uploaded file metadata.
