# Commit Plan (recommended)

This document outlines a granular commit plan you can follow to create a clear, reviewable history across feature branches. The plan groups related small commits; each bullet is suggested as one commit.

Guidelines:
- Keep each commit focused and small (one logical change).
- Use feature branches (e.g., `feature/auth`, `feature/pets`, `feature/admin`, `feature/ui-polish`).
- Run tests/lint/tsc before pushing each branch.

Suggested commit groups (each sub-bullet = 1 commit):

1) repo:initial-setup
- add project skeleton (vite + tsconfig + tailwind)
- add basic package.json and dependencies
- add .gitignore and README

2) feature/ts-stabilization
- enable strict TypeScript settings
- fix type errors in stores
- export shared types

3) feature/ui-components
- add `Button` component
- add `Card`, `Loader`, `Toast`
- add accessible `Input` (forwardRef)
- add accessible `Textarea`
- add `Modal` with focus management

4) feature/auth
- add `authStore` (Zustand) types and persistence
- implement `LoginPage` UI
- implement `RegisterPage` UI
- wire protected routes

5) feature/pets
- add `petStore` CRUD functions
- implement `PetCard` UI
- implement `Adopt` list page
- implement `PetDetailPage` with booking modal

6) feature/bookings
- add `bookingStore` functions (create/approve/reject)
- add `MyBookingsPage` and `FavouritesPage`

7) feature/admin-pages
- add `ManagePetsPage` (add/edit/delete)
- add `ManageUsersPage` (role toggle, protections)
- add `ManageBookingsPage` (approve/reject workflows)

8) feature/accessibility
- add landmarks and `h1` where needed
- add aria labels and error alerts
- ensure modal dialogs have `role="dialog"` and `aria-modal`

9) feature/scripts-and-ops
- add `scripts/axe-playwright.mjs`
- add `scripts/create_prs.sh` and `scripts/create_prs.ps1`
- add `PR_INSTRUCTIONS.md` and `CHANGELOG.md`

10) feature/polish
- responsive tweaks
- small CSS/tailwind fixes
- adjust animations and image placeholders

Release/merge plan:
- For each feature branch, create 5–15 small commits following the sub-bullets above.
- Open one PR per feature branch targeting `main`.
- Use draft PRs for large features and request reviews early.

Example commands to create and push a branch:

```bash
git checkout -b feature/auth
# make small commits as per plan
git add -A && git commit -m "auth: add authStore with types"
git push origin feature/auth
```

If you want, I can generate a script to automatically create many small commits locally (used earlier) — tell me how many commits per feature you want and I will scaffold the script (you run it locally).
