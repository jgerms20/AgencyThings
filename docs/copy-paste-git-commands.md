# Copy/Paste Git Commands

Use these commands exactly. Do **not** type angle brackets like `<OWNER>` or `<jgerms20>`; those are placeholders in documentation and zsh treats them as redirection.

## If the repo is not on your Mac yet

```bash
cd ~
git clone https://github.com/jgerms20/AgencyThings.git
cd AgencyThings
```

## If the repo is already on your Mac

```bash
cd ~/AgencyThings
git pull
```

If `cd ~/AgencyThings` says the folder does not exist, use the clone commands above.

## Important: get the helper script first

The helper script only exists after the PR containing it is merged into the branch you pulled. After merging/pulling the latest code, confirm the script exists:

```bash
ls scripts/push-latest-branch.sh
```

If that says `No such file or directory`, you are still on an older branch/commit and need to merge or pull the latest PR first.

## Push the latest version branch

After the script exists, run:

```bash
./scripts/push-latest-branch.sh
```

## Manual fallback without the helper script

If you want to avoid the helper script entirely, run this from inside `~/AgencyThings`:

```bash
git checkout -b version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc
git push origin version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc
```

If Git says the branch already exists, run:

```bash
git checkout version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc
git push origin version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc
```

## Then deploy from the branch

In GitHub:

1. Go to **Settings → Pages**.
2. Set **Source** to **Deploy from a branch**.
3. Select `version-2-latest-digital-task-brief-maker-2026-06-25-0001-utc`.
4. Select `/ (root)`.
5. Save.
