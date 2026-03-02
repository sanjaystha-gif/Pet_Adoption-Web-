# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-03-02

### Added
- Completed frontend implementation for PawBuddy (React + Vite + TypeScript + Tailwind + Zustand).
- Typed Zustand stores for auth, pets, and bookings with mock persistence.
- Auth flows: login, register, persistent session, profile update.
- Admin CRUD pages: manage pets, users, and bookings with accessible modals.
- Public pages: Home, Adopt, Pet detail with booking flow wired.
- Shared UI components improved (accessible `Input`, `Textarea`, `Modal`, `Button`, `Toast`).
- Automated accessibility audit script using Playwright + axe (`scripts/axe-playwright.mjs`).
- Git helper scripts for PR creation (`scripts/create_prs.sh`, `scripts/create_prs.ps1`) and `PR_INSTRUCTIONS.md`.

### Fixed
- Resolved TypeScript strict-mode issues across pages and stores.
- Resolved accessibility issues found during manual pass (role landmarks, aria attributes, focus management).

### Security
- Exposed PATs were detected in chat history; user instructed to revoke them immediately. No tokens were committed to the repository.

### Notes
- Run `npm run build` then `node ./scripts/axe-playwright.mjs` to generate `axe-report.json`.
- Run `npx tsc --noEmit` to verify TypeScript strictness (already validated locally).

----

For detailed commit-level history and a recommended commit plan to produce granular commits, see `COMMIT_PLAN.md`.
# Changelog

All notable changes to this project are documented here.

## [Unreleased] - 2026-03-02

### Added
- Completed public pages (Home, Adopt, Pet Detail, Care Guide, About)
- Accessibility improvements (ARIA, keyboard support, modal and navbar fixes)
- Automated accessibility audit via Playwright + axe
- Playwright audit script `scripts/axe-playwright.mjs` and `axe-report.json`

### Changed
- Stabilized Tailwind/PostCSS build and adjusted global styles
- Typed UI components and Zustand stores; fixed TypeScript errors

### Fixed
- Resolved TypeScript errors and validation issues across components and stores

2026-03-02T11:29:50.424Z - feature/final-fixes - incremental change #1
2026-03-02T11:29:50.499Z - feature/final-fixes - incremental change #2
2026-03-02T11:29:50.576Z - feature/final-fixes - incremental change #3
