# Pull Request Descriptions

Use these descriptions when opening PRs for the feature branches pushed from this workspace. You can create PRs using the `scripts/create_prs.sh` / `scripts/create_prs.ps1` helpers or with the `gh` CLI.

---

## feature/finalize
- **Title:** chore: finalize frontend — build, types, lint, a11y, changelog
- **Description:**
  - Finalize PawBuddy frontend implementation: ensure production build passes, strict TypeScript checks, accessibility audit (axe) clean, and linting fixed.
  - Files included: typed Zustand stores, UI component accessibility improvements, admin/public/user pages completed, audit and helper scripts, `CHANGELOG.md` and `COMMIT_PLAN.md`.
  - Manual steps for reviewers: run `npm install`, `npm run build`, `npx tsc --noEmit`, and `npx eslint .` locally.

---

## feature/auth
- **Title:** feat(auth): implement typed auth store and pages
- **Description:**
  - Adds `useAuthStore` with localStorage persistence, login/register flows, and accessible forms.
  - Includes `LoginPage` and `RegisterPage` with validation and keyboard-focus improvements.

---

## feature/admin-pages
- **Title:** feat(admin): add admin CRUD pages for pets, users, bookings
- **Description:**
  - Implements `ManagePetsPage`, `ManageUsersPage`, and `ManageBookingsPage` with accessible modals and role protections.

---

## feature/public-pages
- **Title:** feat(public): implement public pages and booking flow
- **Description:**
  - Adds `HomePage`, `AdoptPage`, `PetDetailPage` with booking modal wired to `bookingStore`.

---

## How to push and open PRs (local)

Using `gh` (recommended):

```bash
git push origin feature/finalize
gh pr create --base main --head feature/finalize --title "chore: finalize frontend — build, types, lint, a11y, changelog" --body-file PR_DESCRIPTIONS.md
```

Using provided scripts (requires `GITHUB_TOKEN` in env):

```bash
# POSIX
export GITHUB_TOKEN=ghp_...
bash ./scripts/create_prs.sh

# PowerShell
$env:GITHUB_TOKEN = 'ghp_...'
pwsh ./scripts/create_prs.ps1
```

Notes:
- Do NOT paste tokens into chat. Revoke any exposed token at https://github.com/settings/tokens and create a new minimal-scope PAT (repo:public_repo).
- I can attempt to push branches and open PRs if you grant permission to run network git operations here, or you can run the commands locally for safety.
