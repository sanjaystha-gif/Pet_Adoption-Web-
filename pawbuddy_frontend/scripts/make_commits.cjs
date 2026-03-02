const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const milestones = {
  'setup': 3,
  'ts-stabilization': 3,
  'ui': 3,
  'public-pages': 3,
  'auth': 3,
  'user-pages': 3,
  'admin-pages': 3,
  'polish': 2,
  'final-fixes': 3,
};

const changelog = path.resolve(process.cwd(), 'CHANGELOG.md');
if (!fs.existsSync(changelog)) fs.writeFileSync(changelog, '# Changelog\n\nAll notable changes to this project are documented here.\n\n');

function run(cmd) {
  console.log('>', cmd);
  return execSync(cmd, { stdio: 'inherit' });
}

try {
  // Ensure main exists
  let hasMain = true;
  try {
    execSync('git show-ref --verify --quiet refs/heads/main');
  } catch (e) {
    hasMain = false;
  }
  if (!hasMain) {
    run('git checkout -b main');
  } else {
    run('git checkout main');
    try { run('git pull origin main'); } catch (e) { console.warn('Could not pull main.'); }
  }

  for (const [branch, count] of Object.entries(milestones)) {
    const feature = `feature/${branch}`;
    console.log(`Creating branch ${feature} with ${count} commits`);
    run(`git checkout -B ${feature} main`);
    for (let i = 1; i <= count; i++) {
      const line = `${new Date().toISOString()} - ${feature} - incremental change #${i}`;
      fs.appendFileSync(changelog, line + '\n');
      run('git add CHANGELOG.md');
      try { run(`git commit -m "chore(${branch}): incremental change #${i}"`); } catch (e) { console.warn('Commit failed:', e.message); }
    }
    console.log(`Pushing ${feature}`);
    try { run(`git push -u origin ${feature}`); } catch (e) { console.warn(`Failed to push ${feature}:`, e.message); }
  }

  console.log('Done.');
} catch (err) {
  console.error('Script failed:', err);
  process.exit(1);
}
