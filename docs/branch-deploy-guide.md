# Versioned Branch Deploy Guide

## Why the live site still looks old

The screenshot showing the purple three-step page means GitHub Pages is still deploying an older branch/commit. The newest app build in this repo should show a top badge that says:

```text
Current build: linear upload workflow · 2026-06-24
```

If that badge is missing, you are not viewing the latest build.

## Branches to use

Use explicit versioned branches so GitHub Pages can deploy a known build instead of whichever branch happened to be selected before.

| Branch | What it is for |
| --- | --- |
| `version-1-initial-2026-06-25-0000-utc` | Original repo baseline before the brief maker. |
| `version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc` | Latest Digital Task Brief Maker build with upload workflow, PDF/XLSX/PPTX import, image search verification, match-confidence details, yellow visual system, and deployment build badge. |

## How to make the branch appear in GitHub

A branch will not appear in GitHub until it is pushed. After the branch exists locally, push it with:

```bash
git push origin version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc
```

If the remote is not named `origin`, check the remote name with:

```bash
git remote -v
```

Then replace `origin` with the remote name shown there.

## How to deploy the latest versioned branch

1. Push `version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc` to GitHub.
2. In GitHub, go to **Settings → Pages**.
3. If using **Deploy from a branch**, choose:
   - **Branch:** `version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc`
   - **Folder:** `/ (root)`
4. Save.
5. Wait for the Pages deployment to finish.
6. Open the Pages URL and confirm the top badge says `Current build: linear upload workflow · 2026-06-24`.

## If using GitHub Actions instead

The workflow file is included in the latest branch, so once that branch is pushed you can also run:

**Actions → Deploy Digital Task Brief Maker → Run workflow**

Choose the latest versioned branch when GitHub asks which branch to run from.
