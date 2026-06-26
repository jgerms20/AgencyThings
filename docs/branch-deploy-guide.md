# Versioned Branch Deploy Guide

## Why the live site still looks old

If the live page shows only the older three-step MVP or yesterday's upload workflow, GitHub Pages is serving an older branch, an older Actions deployment, or a cached copy. The current guided workflow build should show this top badge:

```text
Current build: guided workflow - 2026-06-26
```

If that badge is missing, you are not viewing the current guided workflow.

## Branches to use

Use an explicit branch so GitHub Pages deploys a known build instead of whichever branch was selected before.

| Branch | What it is for |
| --- | --- |
| `main` | Recommended when Pages is set to GitHub Actions. The workflow publishes `tools/digital-task-brief-maker/` directly. |
| `version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc` | Use this if Pages is set to Deploy from a branch. This branch should point to the current guided workflow build. |

## How to deploy from a branch

1. In GitHub, go to **Settings > Pages**.
2. If using **Deploy from a branch**, choose:
   - **Branch:** `version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc`
   - **Folder:** `/ (root)`
3. Save.
4. Wait for the Pages deployment to finish.
5. Open the Pages URL and confirm the top badge says `Current build: guided workflow - 2026-06-26`.

## If using GitHub Actions instead

1. In **Settings > Pages**, set **Source** to **GitHub Actions**.
2. Go to **Actions > Deploy Digital Task Brief Maker**.
3. Run the workflow from `main`, or wait for the next push to `main`.
4. Open the workflow summary URL and confirm the same build badge.

## Cache check

If the old page still appears after deployment finishes, hard refresh the browser or add this to the end of the URL:

```text
?v=2026-06-26-guided-workflow
```