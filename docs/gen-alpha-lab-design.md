# Gen Alpha Intelligence Lab Design

## Product Shape

Build a separate Vercel-targeted app inside `apps/gen-alpha-lab/`. The existing GitHub Pages root and Digital Task Brief Maker stay unchanged.

The app combines two modes:

- A polished internal agency insight surface that can be shown in strategy conversations.
- A living research lab for collecting interviews, articles, podcasts, reports, and field notes.

## V1 Experience

- Home screen opens with a strong Gen Alpha thesis and a signal map contrasting Gen Alpha with Gen Z.
- Research evidence appears as tagged records with source type, status, confidence, summary, and citations.
- Interviews can be added through an upload/manual-entry workflow.
- Supabase environment variables enable persistent storage on Vercel.
- If Supabase is not configured, the app runs in demo mode and stores user-added records in the browser so the interface is usable immediately.

## Design Direction

The visual system should feel like an agency intelligence room, not a teen moodboard. The page should be editorial, clear, and research-forward: ink text, bright cyan and chartreuse accents, tight panels, restrained controls, and a visible evidence wall.

Avoid a generic marketing page. The first screen should be a usable product surface with navigation, signal cards, source records, filters, and upload controls.

## Deployment

Vercel should point to `apps/gen-alpha-lab` as the project root. This keeps the GitHub Pages deployment for the older tool intact while giving the Gen Alpha lab its own URL.
