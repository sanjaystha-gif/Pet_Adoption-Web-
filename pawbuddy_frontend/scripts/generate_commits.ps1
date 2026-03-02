param(
  [string]$Branch = "feature/many-commits",
  [int]$Count = 100,
  [string]$Message = "chore: incremental commit"
)

git checkout -b $Branch
$file = "COMMIT_NOTES.md"
for ($i = 1; $i -le $Count; $i++) {
  $line = "$(Get-Date -Format o) - commit #$i"
  Add-Content -Path $file -Value $line
  git add $file
  git commit -m "$Message #$i"
}

Write-Host "Created $Count commits on branch '$Branch'."
Write-Host "Push with: git push origin $Branch"
