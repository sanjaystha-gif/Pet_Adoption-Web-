This folder contains a helper script to create granular milestone branches and many small commits for a clean Git history.

Files:
- make_commits.ps1 — PowerShell script that creates branches and commits locally.

Quick use (local only):
1. Open PowerShell in the repository root (`pawbuddy_frontend`).
2. Run:

```powershell
.\scripts\make_commits.ps1
```

This will create local branches:
- feature/setup
- feature/ts-stabilization
- feature/ui
- feature/public-pages
- feature/auth
- feature/user-pages
- feature/admin-pages
- feature/polish
- feature/final-fixes

Each branch will receive multiple small commits (configurable inside the script).

To push branches to GitHub (requires credentials/configured remote):
1. Either set the origin remote ahead of time:

```powershell
git remote add origin https://github.com/youruser/Pet_Adoption-Web-.git
```

2. Or run the script with the `-PushRemote` flag and `-RemoteUrl`:

```powershell
.\scripts\make_commits.ps1 -PushRemote -RemoteUrl 'https://github.com/youruser/Pet_Adoption-Web-.git'
```

Notes & recommendations:
- Pushing will prompt for credentials or use your Git credential helper.
- Review branches/commits locally before pushing. The script only edits `CHANGELOG.md` to create commits — adjust to include other targeted files if you prefer.
- After pushing, open PRs per milestone and merge into `main` using GitHub's UI (squash or merge as your workflow requires).

If you want, I can:
- Adjust the commit counts or branch names.
- Create scripts to open PRs using GitHub CLI (gh) if you have it installed and authenticated.
- Automatically stage and commit specific feature files instead of only `CHANGELOG.md`.
