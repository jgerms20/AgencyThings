# Digital Task Brief Maker Deployment

## Short answer: what URL should I use?

After GitHub Pages deploys, use the URL GitHub shows in **Settings → Pages**.

For this repository, it will usually be:

```text
https://<your-github-username-or-org>.github.io/AgencyThings/
```

Examples:

- If the repo is under `joshuagerman`, use `https://joshuagerman.github.io/AgencyThings/`.
- If the repo is under an org called `my-agency`, use `https://my-agency.github.io/AgencyThings/`.

The exact URL depends on the GitHub account or organization that owns the repository. If you are unsure, look at the browser URL for the repo on GitHub. In `https://github.com/OWNER/AgencyThings`, the `OWNER` part is what goes before `.github.io`.

## If you do not see the Action in the Actions tab

This is common right after adding a new workflow. Check these first:

1. **Is this code merged or pushed to GitHub?** GitHub will not show a workflow that only exists locally or only exists in an unmerged PR branch you are not viewing.
2. **Are you looking at the correct branch?** On the **Actions** tab, switch the branch filter to the branch that contains `.github/workflows/deploy-digital-task-brief-maker.yml`.
3. **Is Actions enabled for the repo?** Go to **Settings → Actions → General** and make sure actions are allowed.
4. **Did GitHub index the workflow yet?** Sometimes the workflow appears after the next push to the branch or after the PR is merged.

If it still does not show up, you can publish the site without Actions using the branch fallback below.

## Option A: Recommended GitHub Actions deployment

In GitHub, go to:

1. **Settings**
2. **Pages**
3. **Build and deployment**
4. Set **Source** to **GitHub Actions**

After that, every push to `main`, `master`, or `work` runs the deploy workflow. You can also run it manually from the **Actions** tab using **Deploy Digital Task Brief Maker → Run workflow**.

Where to find the live URL:

1. Open the repo on GitHub.
2. Go to **Actions**.
3. Click **Deploy Digital Task Brief Maker**.
4. Click the latest successful workflow run.
5. Open the summary or the `deploy` job and use the `page_url` / deployment URL shown there.

## Option B: Fallback deployment without Actions

If the workflow is not showing up, use GitHub Pages' branch deployment instead:

1. Open the repo on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the branch that contains this code, usually `main` or `master`.
5. Choose the folder `/(root)`.
6. Save.
7. Wait for GitHub to publish the site, then click **Visit site**.

The repository root now includes the actual app shell in `index.html`, so the main GitHub Pages URL should open the tool workspace automatically.

## Where to find the live URL in GitHub

Use any of these paths:

### Option 1: Settings

1. Open the repo on GitHub.
2. Go to **Settings → Pages**.
3. Look for the green success message near the top.
4. Click **Visit site**.

### Option 2: Guess the standard project URL

Use:

```text
https://OWNER.github.io/AgencyThings/
```

Replace `OWNER` with the GitHub username or org from the repo URL.

## Why the earlier local command returned 404

The Python server command uses a path that is relative to the folder where the command is run:

```bash
python3 -m http.server 4173 --directory tools/digital-task-brief-maker
```

If you run that command from your home folder instead of the repository folder, Python starts a server but points it at a folder that does not exist from there. The result is a working server that returns `404 File not found` for `/`.

If you ever do want to run it locally for testing, first `cd` into the repository folder and then run the command:

```bash
cd /path/to/AgencyThings
python3 -m http.server 4173 --directory tools/digital-task-brief-maker
```

But the recommended workflow is to use the hosted GitHub Pages URL so you do not need Terminal at all.

## If the GitHub Pages URL still 404s

Check these in order:

1. **Pages source:** Settings → Pages should show either **GitHub Actions** with a successful workflow or **Deploy from a branch** with `/(root)` selected.
2. **Workflow status:** If using Actions, **Actions → Deploy Digital Task Brief Maker** should show a green successful run.
3. **Branch:** The workflow currently runs on `main`, `master`, and `work`. If your default branch has another name, add it to `.github/workflows/deploy-digital-task-brief-maker.yml`.
4. **Wait a few minutes:** The first Pages deployment can take a little time after the workflow succeeds.
5. **Use the trailing slash:** Use `/AgencyThings/`, not `/AgencyThings` if your browser or network is being picky.

## If the live site still shows the old purple three-step version

If the page still says **AgencyThings · Work tools**, shows only **Step 1 / Step 2 / Step 3**, or does not show the **Upload XLSX/PDF/PPTX/CSV** drop zone, GitHub Pages is serving an older deployment.

Use this checklist:

1. Confirm the latest PR containing the creative layout overhaul has been merged into the branch that Pages deploys.
2. Go to **Actions → Deploy Digital Task Brief Maker** and confirm the latest run happened after the merge.
3. Open the latest workflow run and confirm the deployment summary points to the URL you are opening.
4. Hard refresh the live page with `Shift` + browser refresh, or add `?v=2026-06-25` to the end of the URL.
5. Look for the badge at the top of the tool that says `Current build: cache-busted working ingest · 2026-06-25`. If that badge is missing, you are not on the newest deployed build.

The current build should show:

- A yellow-forward visual treatment.
- A top build badge.
- Linear steps for upload, review, verify, image search, and export.
- An upload drop zone for XLSX, PDF, PPTX, CSV, TSV, TXT, and pasted deliverables lists.
