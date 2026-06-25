#!/usr/bin/env bash
set -euo pipefail

LATEST_BRANCH="version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc"

if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
  cat <<MSG
This command must be run inside your AgencyThings git repository.

Try one of these first:

  cd /path/to/AgencyThings

Or, if the repo is not on your computer yet:

  git clone https://github.com/<OWNER>/AgencyThings.git
  cd AgencyThings

Then run:

  ./scripts/push-latest-branch.sh
MSG
  exit 1
fi

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

if ! git show-ref --verify --quiet "refs/heads/${LATEST_BRANCH}"; then
  echo "Creating ${LATEST_BRANCH} from current HEAD..."
  git branch "${LATEST_BRANCH}"
fi

remote="${1:-origin}"

echo "Pushing ${LATEST_BRANCH} to ${remote}..."
git push "${remote}" "${LATEST_BRANCH}"

echo "Done. In GitHub Pages, select branch: ${LATEST_BRANCH} and folder: / (root)."
