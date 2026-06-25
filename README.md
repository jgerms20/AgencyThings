# AgencyThings

A repository for practical agency/work tools, templates, and experiments.

## Tools

### Digital Task Brief Maker

A hosted browser workspace for turning media-plan rows into creative-ready digital task briefs with placement matching, verification sources, example clipping prompts, and exportable brief cards.

**Location:** `tools/digital-task-brief-maker/`

**Recommended way to use it:** deploy it with GitHub Pages and open the hosted URL in your browser. You should not need to run a local Python server for day-to-day use.

**What it does now:**

- Accepts pasted deliverables lists plus CSV, TSV, TXT, Excel, PDF, or PowerPoint uploads from a media plan.
- Auto-matches common placements against a starter spec library.
- Generates printable brief cards with specs, copy placeholders, source links, match-confidence details, safe-zone visuals, creative prompts, and example-search starters.
- Exports brief text to clipboard, JSON, browser PDF/print, or PowerPoint.

**Deploy online:**

Recommended path:

1. Merge this code into your default branch.
2. In GitHub, go to **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Go to **Actions** and run or wait for **Deploy Digital Task Brief Maker**.
5. Open the GitHub Pages URL shown by the workflow summary. It will usually be `https://<your-github-username>.github.io/AgencyThings/`.

If you do not see the workflow under **Actions**, use the fallback in **Settings → Pages**: set **Source** to **Deploy from a branch**, choose your default branch, and choose `/ (root)`. The root `index.html` is the tool experience, so the main Pages URL opens the workspace directly.

See `docs/digital-task-brief-maker-deployment.md` for the full deployment notes, exact places to find the URL, and 404 troubleshooting. If GitHub Pages keeps showing an old build, use `docs/branch-deploy-guide.md` to deploy from the latest versioned branch, use `docs/copy-paste-git-commands.md` for exact Terminal commands, or run `./scripts/push-latest-branch.sh` from inside the repo to push the latest branch.

## Roadmap

See `docs/digital-task-brief-maker-plan.md` for the recommended product plan, data model, and next phases.
