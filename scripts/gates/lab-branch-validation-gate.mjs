import { execSync } from 'child_process';

const TARGET_BRANCH = process.env.GITHUB_BASE_REF || 'main';
const SOURCE_BRANCH = process.env.GITHUB_HEAD_REF || execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

console.log(`[Gate] Validating PR from '${SOURCE_BRANCH}' to '${TARGET_BRANCH}'...`);

// 1. Rule: Never merge lab branches directly to main.
if (SOURCE_BRANCH.startsWith('lab/') && TARGET_BRANCH === 'main') {
  console.error('❌ [FATAL] ETERNAL NEXUS RULE VIOLATION: Never merge lab branches directly to main.');
  console.error('   Successful ideas must be re-implemented cleanly in your agent branch with tests and evidence.');
  process.exit(1);
}

// 2. Rule: Every meaningful commit/PR must include a log evidence.
if (TARGET_BRANCH === 'main' && SOURCE_BRANCH.startsWith('agent/')) {
  try {
    // If running in CI, we get the changed files in the PR
    let changedFiles = '';
    if (process.env.GITHUB_EVENT_PATH) {
      // In GH Actions, fetch the PR files using git
      execSync('git fetch origin main');
      changedFiles = execSync('git diff --name-only origin/main...HEAD').toString();
    } else {
      // Local fallback
      changedFiles = execSync('git diff --name-only main...HEAD').toString();
    }

    const hasLog = changedFiles.split('\n').some(file => file.startsWith('NEXUS_CONTEXT/LOGS/') && file.endsWith('.md'));
    
    if (!hasLog) {
      console.error('❌ [FATAL] ETERNAL NEXUS RULE VIOLATION: Missing Commit-as-Report.');
      console.error('   Every merge to main must include a report/log under NEXUS_CONTEXT/LOGS/.');
      process.exit(1);
    }
  } catch (err) {
    console.warn('⚠️ [WARN] Could not verify log presence (git diff failed). Skipping check.');
  }
}

console.log('✅ [Gate] Lab-Branch Validation Gate PASSED.');
