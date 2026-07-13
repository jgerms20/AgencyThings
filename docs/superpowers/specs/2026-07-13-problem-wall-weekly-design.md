# Problem Wall Weekly Discovery Design

## Purpose

Problem Wall Lab becomes a weekly discovery tool for finding fresh, source-backed human problems, rating them with the B.U.R.S.T. method, and helping Joshua build a shortlist. The visible product stops trying to manage strategist assignments, client handoffs, or deck production.

## Core Workflow

The interface has one obvious sequence:

1. **Find new problems**: run the live source refresh now.
2. **Review this week**: scan newly generated problem candidates and their source evidence.
3. **Shortlist**: save promising candidates without approving or assigning them.
4. **Wrap up**: review the shortlist and export a concise weekly summary.

The default screen opens on `This week`. A run timestamp and source summary make freshness visible.

## Content States

- **New this week**: generated from the current live refresh only
- **Shortlist**: candidates Joshua explicitly saved
- **Reviewed**: candidates dismissed or passed over during the week
- **Deck inspiration**: original deck-derived examples, clearly labeled and excluded from new weekly counts

Seed examples never appear as if they were newly discovered. When live sources fail, the interface reports the failure and keeps deck inspiration available in its separate area; it does not silently mix fallback examples into `New this week`.

## Candidate Anatomy

Each candidate shows:

- Problem statement
- Bigger reason to care
- Root or targeted cause
- Source title, publisher, publication date, and direct link
- Freshness label
- B.U.R.S.T. total and five-dimension breakdown
- `Add to shortlist` or `Remove from shortlist`
- `Pass` action

Client name, strategist name, strategist email, client fit, and deck-ready opportunity copy are removed from the primary candidate and inspector experience.

## B.U.R.S.T. Method

Each candidate scores 1–5 on:

- Bigger reason to care
- Unexpectedness
- Relevancy and urgency
- Specificity
- Targeted, solvable cause

The score is generated from evidence, freshness, audience specificity, articulated consequence, and cause quality. The interface explains why each dimension received its score. A high total cannot compensate for missing source evidence; unsupported candidates are capped below `wall ready`.

## Source Pipeline

The weekly refresh uses multiple source families:

- Google News RSS queries for newly published studies, surveys, and changing behavior
- OpenAlex or Crossref for recent research papers
- Public Reddit JSON or RSS for emerging lived friction in selected communities
- Selected institutional and research feeds where available

Queries cover broad problem territories such as work, learning, health, technology, family, media, money, consumer behavior, accessibility, climate, and community life. They are not limited to the current client list.

The pipeline normalizes source metadata, removes duplicates, rejects stale or source-less items, labels community material separately, and generates candidate framing from the actual source content available. Direct links are retained throughout.

## Automation And Persistence

- `Find new problems` calls the same server pipeline as the scheduled job.
- Vercel Cron runs every Monday.
- The cron endpoint verifies `CRON_SECRET` when configured.
- Weekly runs and shortlist state persist to Supabase when configured.
- Local demo persistence remains available for manual review if hosted persistence is unavailable.
- The UI exposes last successful refresh, source counts, and partial-source failures.

The scheduled run prepares the week's pool; it does not automatically shortlist or export anything.

## Wrap-Up

The Wrap Up view contains only shortlisted items. It provides:

- Ranked shortlist
- Score and source summary
- Editable note per candidate
- Copy summary action
- JSON download

Deck formatting, strategist assignment, and client matching remain outside this product.

## Visual Direction

The redesign is calmer and more sequential than the current command center:

- One main reading column with a narrow weekly summary rail
- White and near-black base with coral-red for fresh/urgent material
- Compact source metadata and score disclosure
- No five-step workflow strip
- No always-open scoring inspector
- No full-screen card stack competing with a dense sidebar
- Shortlist actions remain visible without overwhelming the source story

## Verification

Completion requires:

1. `Find new problems` produces a visibly new run or an explicit source failure state.
2. New weekly candidates never include deck inspiration or silently labeled fallback data.
3. Every new candidate has a direct source URL and publication date.
4. B.U.R.S.T. scoring tests cover evidence caps, freshness, specificity, and targeted cause.
5. Add/remove shortlist, pass, notes, copy summary, and JSON export work.
6. The Monday cron uses the same refresh logic and reports persistence mode.
7. Strategist, email, client-fit, and deck-export UI are absent from the primary workflow.
8. Desktop and 390px mobile layouts have no overflow or incoherent overlap.
