#!/usr/bin/env bash
set -euo pipefail
# Usage: ./scripts/generate_commits.sh [branch] [count] [message]
BRANCH=${1:-feature/many-commits}
COUNT=${2:-100}
MESSAGE=${3:-"chore: incremental commit"}
FILE="COMMIT_NOTES.md"

git checkout -b "$BRANCH"
for i in $(seq 1 "$COUNT"); do
  echo "$(date --iso-8601=seconds) - commit #$i" >> "$FILE"
  git add "$FILE"
  git commit -m "$MESSAGE #$i"
done

echo "Created $COUNT commits on branch '$BRANCH'."
echo "Push with: git push origin $BRANCH"
