PR creation & token handling
=================================

Quick steps (safe, local):

1) Revoke the exposed token immediately:
   - Open https://github.com/settings/tokens and delete the token you exposed.

2) Create a new minimal-scope PAT:
   - For creating PRs, the `repo` scope is sufficient for a private repo. For public-only PRs, `public_repo` may be enough.

3) Clear local cached credentials (Windows):
   - Control Panel → Credential Manager → Windows Credentials → remove any `github.com` entries.

4) Run the PR scripts locally (do not paste tokens into chat):

PowerShell (recommended on Windows):

```powershell
$env:GITHUB_TOKEN = "YOUR_NEW_TOKEN"
pwsh .\scripts\create_prs.ps1
```

POSIX (macOS / WSL / Linux):

```bash
export GITHUB_TOKEN="YOUR_NEW_TOKEN"
bash ./scripts/create_prs.sh
```

Notes:
- Both scripts read `GITHUB_TOKEN` from the environment. They will not accept tokens via stdin or chat.
- The POSIX script requires `jq` and `curl`.
- The scripts attempt to derive the repo owner/name from the `origin` remote; edit the variables in the scripts if necessary.

If you'd like, I can also add a small `README` section to the main `README.md` in the repo.
