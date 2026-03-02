# Creates many small commits across milestone branches to generate a clean, granular history.
# Usage: .\scripts\make_commits.ps1 [-PushRemote] [-RemoteUrl 'https://github.com/you/repo.git']
param(
  [switch]$PushRemote,
  [string]$RemoteUrl = '',
  [string]$CommitPrefix = 'chore',
  [switch]$IncludeTimestamp
)

$ErrorActionPreference = 'Stop'

# Configure these milestones & commit counts (adjust as desired)
# You can optionally provide a JSON override at scripts/commit_config.json
$defaultMilestones = @{
  'setup' = 10
  'ts-stabilization' = 12
  'ui' = 12
  'public-pages' = 12
  'auth' = 12
  'user-pages' = 12
  'admin-pages' = 12
  'polish' = 10
  'final-fixes' = 12
}

$configPath = Join-Path -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition) -ChildPath 'commit_config.json'
$milestones = $defaultMilestones
if (Test-Path $configPath) {
  try {
    $json = Get-Content $configPath -Raw | ConvertFrom-Json
    if ($json.milestones) {
      $milestones = @{}
      foreach ($k in $json.milestones.PSObject.Properties.Name) {
        $milestones[$k] = [int]$json.milestones.$k
      }
    }
  } catch {
    Write-Host "Warning: failed to parse $configPath - using defaults"
  }
}

# Ensure a changelog file exists to edit for commits
$changelog = 'CHANGELOG.md'
if (-not (Test-Path $changelog)) {
  $header = "# Changelog`n`nAll notable changes to this project are documented in this file.`n`n"
  Set-Content -Path $changelog -Value $header -Encoding utf8
}

# Make sure we're on main and up-to-date locally (create main if it doesn't exist)
Write-Host "Checking/creating main and updating..."
if (-not (git show-ref --verify --quiet refs/heads/main)) {
  Write-Host "'main' branch not found locally — creating from current HEAD"
  git checkout -b main
} else {
  git checkout main
}
try { git pull origin main } catch { Write-Host "Warning: could not pull from origin/main. Continuing locally." }

if ($PushRemote -and $RemoteUrl) {
  if (-not (git remote get-url origin 2>$null)) {
    git remote add origin $RemoteUrl
  }
}

foreach ($branch in $milestones.Keys) {
  $count = $milestones[$branch]
  $feature = "feature/$branch"
  Write-Host "Creating branch $feature with $count commits..."
  # Create branch from main
  git checkout -B $feature main
  for ($i=1; $i -le $count; $i++) {
    $when = if ($IncludeTimestamp) { "$(Get-Date -Format o) - " } else { "" }
    $message = "incremental change #$i"
    $line = "$when$feature - $message"
    Add-Content -Path $changelog -Value $line
    git add $changelog
    $commitMsg = "${CommitPrefix}($branch): $message"
    git commit -m $commitMsg
  }
  # Optionally push branch
  if ($PushRemote) {
    Write-Host "Pushing $feature to origin..."
    git push -u origin $feature
  } else {
    Write-Host "Created local branch $feature with $count commits (not pushed)."
  }
}

Write-Host "All branches created. Total commits created:" 
git rev-list --count --all
Write-Host "Done."
