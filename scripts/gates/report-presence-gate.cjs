/**
 * Report Presence Gate
 *
 * Enforces the pre-merge collaboration surface:
 * - a stable NEXUS_CONTEXT/HANDOFF.md
 * - a topic log referenced from the handoff
 * - the required report sections
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = process.cwd();
const HANDOFF_PATH = 'NEXUS_CONTEXT/HANDOFF.md';
const LOG_DIR = 'NEXUS_CONTEXT/LOGS';
const REQUIRED_LOG_SECTIONS = [
  '## What changed',
  '## Why',
  '## How to verify',
  '## Risks',
  '## Rollback',
  '## Next 3 tasks',
  '## Suggestions for other pioneers',
];

function runGit(args) {
  return cp.execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function getChangedFiles() {
  const eventName = process.env.GATE_EVENT_NAME || '';
  const baseRef = process.env.GATE_BASE_REF || 'main';
  const statusLines = cp.execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);
  const workingTreeFiles = statusLines
    .map(line => line.slice(3).trim())
    .filter(Boolean);

  if (!eventName && workingTreeFiles.length > 0) {
    return [...new Set(workingTreeFiles)];
  }

  if (eventName === 'push') {
    try {
      return runGit(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD~1..HEAD'])
        .split(/\r?\n/)
        .filter(Boolean);
    } catch {
      return runGit(['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'])
        .split(/\r?\n/)
        .filter(Boolean);
    }
  }

  const remoteBase = `origin/${baseRef}`;
  try {
    runGit(['rev-parse', '--verify', remoteBase]);
    return runGit(['diff', '--name-only', '--diff-filter=ACMR', `${remoteBase}...HEAD`])
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function isLogPath(relPath) {
  return /^NEXUS_CONTEXT\/LOGS\/\d{4}-\d{2}-\d{2}_[a-z0-9-]+_[a-z0-9-]+\.md$/i.test(relPath);
}

function fail(message, details = []) {
  console.error(`Report Presence Gate FAILED: ${message}`);
  details.forEach(detail => console.error(` - ${detail}`));
  process.exit(1);
}

const changedFiles = getChangedFiles();

if (!exists(HANDOFF_PATH)) {
  fail('missing stable handoff file', [HANDOFF_PATH]);
}

const handoffContent = read(HANDOFF_PATH);
const reportMatch = handoffContent.match(/Path:\s*`(NEXUS_CONTEXT\/LOGS\/[^`]+\.md)`/);
const reviewMatch = handoffContent.match(/## What other pioneers should review now/);

if (!reportMatch) {
  fail('handoff does not point to a latest report path', [HANDOFF_PATH]);
}

const latestReportPath = reportMatch[1];

if (!exists(latestReportPath)) {
  fail('handoff points to a missing report file', [latestReportPath]);
}

if (!reviewMatch) {
  fail('handoff is missing the pioneer review section', [HANDOFF_PATH]);
}

if (changedFiles.length > 0) {
  const changedLogs = changedFiles.filter(isLogPath);
  if (!changedFiles.includes(HANDOFF_PATH)) {
    fail('current branch update did not refresh the stable handoff', [HANDOFF_PATH]);
  }

  if (changedLogs.length === 0) {
    fail('current branch update did not include a topic log', [LOG_DIR]);
  }

  if (!changedLogs.includes(latestReportPath)) {
    fail('handoff latest report does not match the changed topic log', [latestReportPath]);
  }
}

if (!isLogPath(latestReportPath)) {
  fail('latest report does not use the topic-log naming convention', [latestReportPath]);
}

const reportContent = read(latestReportPath);
const missingSections = REQUIRED_LOG_SECTIONS.filter(section => !reportContent.includes(section));

if (missingSections.length > 0) {
  fail('latest report is missing required sections', missingSections);
}

console.log('Report Presence Gate PASSED.');
