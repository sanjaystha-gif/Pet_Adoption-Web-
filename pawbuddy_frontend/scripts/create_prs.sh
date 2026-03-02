#!/usr/bin/env bash
set -euo pipefail

# create_prs.sh
# Creates pull requests for a list of branches using the GitHub REST API.
# Requirements: curl, jq, git

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERROR: GITHUB_TOKEN environment variable is not set. Export it and re-run."
  exit 2
fi

# Try to derive owner/repo from git remote
remote_url=$(git remote get-url origin 2>/dev/null || true)
if [[ -n "$remote_url" ]]; then
  if [[ "$remote_url" =~ github.com[:/]+([^/]+)/([^/.]+) ]]; then
    OWNER=${BASH_REMATCH[1]}
    REPO=${BASH_REMATCH[2]}
  fi
fi

# Fallback - edit these before running if derivation fails
if [ -z "${OWNER:-}" ]; then
  OWNER='sanjaystha-gif'
fi
if [ -z "${REPO:-}" ]; then
  REPO='Pet_Adoption-Web-'
fi
if [ -z "${BASE_BRANCH:-}" ]; then
  BASE_BRANCH='main'
fi

branches=(
  "feature/setup"
  "feature/ts-stabilization"
  "feature/ui"
  "feature/public-pages"
  "feature/auth"
  "feature/user-pages"
  "feature/admin-pages"
  "feature/polish"
  "feature/final-fixes"
)

API_AUTH_HEADER=("-H" "Authorization: token ${GITHUB_TOKEN}")
API_ACCEPT_HEADER=("-H" "Accept: application/vnd.github+json")
API_UA_HEADER=("-H" "User-Agent: create-pr-script")

pr_exists() {
  local branch="$1"
  local url="https://api.github.com/repos/${OWNER}/${REPO}/pulls?head=${OWNER}:${branch}&base=${BASE_BRANCH}&state=open"
  resp=$(curl -s "${API_AUTH_HEADER[@]}" "${API_ACCEPT_HEADER[@]}" "${API_UA_HEADER[@]}" "$url")
  # requires jq
  if echo "$resp" | jq -e 'length > 0' >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

create_pr() {
  local branch="$1"
  local url="https://api.github.com/repos/${OWNER}/${REPO}/pulls"
  body=$(jq -n --arg t "Merge ${branch} into ${BASE_BRANCH}" --arg h "$branch" --arg b "$BASE_BRANCH" --arg d "Automated PR created by scripts/create_prs.sh" '{title:$t, head:$h, base:$b, body:$d}')
  resp=$(curl -s -X POST "${API_AUTH_HEADER[@]}" "${API_ACCEPT_HEADER[@]}" "${API_UA_HEADER[@]}" -H "Content-Type: application/json" -d "$body" "$url")
  echo "$resp" | jq -r '.html_url // empty'
}

echo "Creating PRs for repository: ${OWNER}/${REPO} (base: ${BASE_BRANCH})"

for b in "${branches[@]}"; do
  echo
  echo "Processing branch: $b"
  if ! git ls-remote --heads origin "$b" | grep -q refs/heads; then
    echo "  Skipping: branch $b not found on remote 'origin'"
    continue
  fi

  if pr_exists "$b"; then
    echo "  PR already exists for $b -> ${BASE_BRANCH}. Skipping."
    continue
  fi

  url=$(create_pr "$b" || true)
  if [ -n "$url" ]; then
    echo "  PR created: $url"
  else
    echo "  Failed to create PR for $b"
  fi
done

echo
echo "Done. Verify PRs on GitHub."
