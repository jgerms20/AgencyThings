# Versioned Branch Deploy Guide

If Terminal is giving placeholder or folder errors, use `docs/copy-paste-git-commands.md` for exact commands using the visible GitHub owner `jgerms20`.

## Why the live site still looks old

The screenshot showing the purple three-step page means GitHub Pages is still deploying an older branch/commit. The newest app build in this repo should show a top badge that says:

```text
Current build: creative layout overhaul · 2026-06-25
```

If that badge is missing, you are not viewing the latest build.

## Branches to use

Use explicit versioned branches so GitHub Pages can deploy a known build instead of whichever branch happened to be selected before.

| Branch | What it is for |
| --- | --- |
| `version-1-initial-2026-06-25-0000-utc` | Original repo baseline before the brief maker. |
| `version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc` | Latest Digital Task Brief Maker build with upload workflow, PDF/XLSX/PPTX import, image search verification, match-confidence details, yellow visual system, and deployment build badge. |

## How to make the branch appear in GitHub

A branch will not appear in GitHub until it is pushed. The command must be run from inside the cloned `AgencyThings` repository, not from your home folder. If you see `fatal: not a git repository`, you are in the wrong folder. Do not type angle brackets like `<OWNER>` or `<jgerms20>`; those are placeholders and zsh treats them as shell syntax.

First go into the repo folder:

```bash
cd /path/to/AgencyThings
```

If the repo is not on your computer yet, clone it first:

```bash
git clone https://github.com/jgerms20/AgencyThings.git
cd AgencyThings
```

Then use the helper script:

```bash
./scripts/push-latest-branch.sh
```

Or push manually:

```bash
git push origin version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc
```

If the remote is not named `origin`, check the remote name with:

```bash
git remote -v
```

Then replace `origin` with the remote name shown there, or pass it to the helper script like `./scripts/push-latest-branch.sh upstream`.

## How to deploy the latest versioned branch

1. Push `version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc` to GitHub.
2. In GitHub, go to **Settings → Pages**.
3. If using **Deploy from a branch**, choose:
   - **Branch:** `version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc`
   - **Folder:** `/ (root)`
4. Save.
5. Wait for the Pages deployment to finish.
6. Open the Pages URL and confirm the top badge says `Current build: creative layout overhaul · 2026-06-25`.

## If using GitHub Actions instead

The workflow file is included in the latest branch, so once that branch is pushed you can also run:

**Actions → Deploy Digital Task Brief Maker → Run workflow**

Choose the latest versioned branch when GitHub asks which branch to run from.
