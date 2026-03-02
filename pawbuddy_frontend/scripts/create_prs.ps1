<#
Create pull requests for a set of branches using the GitHub REST API.

Usage (PowerShell):
  # Set token in environment (do NOT paste tokens into chat)
  $env:GITHUB_TOKEN = "YOUR_NEW_TOKEN"
  # Run the script from repository root
  pwsh .\scripts\create_prs.ps1

Notes:
- The script reads `GITHUB_TOKEN` from the environment and will exit if it's missing.
- Configure `$Owner` and `$Repo` below if the script cannot derive them from `git remote`.
- The script checks whether a PR already exists for a branch before creating one.
#>

Param()

function Get-GitRemoteRepo {
    try {
        $remote = git remote get-url origin 2>$null
        if (-not $remote) { return $null }
        # remote formats: git@github.com:owner/repo.git or https://github.com/owner/repo.git
        if ($remote -match '[:/]([^/]+)\/([^/]+)($|.git)') {
            return @{ Owner = $Matches[1]; Repo = $Matches[2].Replace('.git','') }
        }
    } catch {
        return $null
    }
    return $null
}

$token = $env:GITHUB_TOKEN
if (-not $token) {
    Write-Error "GITHUB_TOKEN not found in environment. Set GITHUB_TOKEN and re-run the script."
    exit 2
}

# Try to derive owner/repo from git remote, otherwise override here
$derived = Get-GitRemoteRepo
if ($derived) {
    $Owner = $derived.Owner
    $Repo = $derived.Repo
} else {
    # <-- Edit these if necessary before running
    $Owner = 'sanjaystha-gif'
    $Repo  = 'Pet_Adoption-Web-'
}

$BaseBranch = 'main'

# Branches to create PRs for (edit if you pushed different names)
$branches = @(
    'feature/setup',
    'feature/ts-stabilization',
    'feature/ui',
    'feature/public-pages',
    'feature/auth',
    'feature/user-pages',
    'feature/admin-pages',
    'feature/polish',
    'feature/final-fixes'
)

$headers = @{
    Authorization = "token $token"
    Accept = 'application/vnd.github+json'
    'User-Agent' = 'create-pr-script'
}

function Pr-Exists($owner, $repo, $branch, $base) {
    $url = "https://api.github.com/repos/$owner/$repo/pulls?head=$owner`:$branch&base=$base&state=open"
    try {
        $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction Stop
        return ($res.Count -gt 0)
    } catch {
        Write-Warning "Failed to check existing PRs for ${branch}: $($_.Exception.Message)"
        return $false
    }
}

function Create-Pr($owner, $repo, $branch, $base) {
    $url = "https://api.github.com/repos/$owner/$repo/pulls"
    $body = @{
        title = "Merge $branch into $base"
        head = $branch
        base = $base
        body = "Automated PR created by scripts/create_prs.ps1"
    } | ConvertTo-Json

    try {
        $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Post -Body $body -ContentType 'application/json' -ErrorAction Stop
        return $res.html_url
    } catch {
        Write-Warning "Failed to create PR for ${branch}: $($_.Exception.Message)"
        return $null
    }
}

Write-Host "Creating PRs for repository: $Owner/$Repo (base: $BaseBranch)"

foreach ($b in $branches) {
    Write-Host "\nProcessing branch: $b" -ForegroundColor Cyan
    if (-not (git ls-remote --heads origin $b)) {
        Write-Warning "Branch $b not found on remote 'origin'. Skipping."
        continue
    }

    if (Pr-Exists $Owner $Repo $b $BaseBranch) {
        Write-Host "PR already exists for $b -> $BaseBranch. Skipping." -ForegroundColor Yellow
        continue
    }

    $url = Create-Pr $Owner $Repo $b $BaseBranch
    if ($url) { Write-Host "PR created: $url" -ForegroundColor Green } else { Write-Warning "PR creation failed for $b" }
}

Write-Host "\nDone. Verify PRs on GitHub." -ForegroundColor Green
