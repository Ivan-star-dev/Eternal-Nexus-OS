import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TASK_FILE = path.join(__dirname, '../../NEXUS_CONTEXT/TASK_SEQUENCE.md');
const INTERVAL_MS = 2 * 60 * 1000;

function notifyUser(title, message) {
  try {
    const popupCmd = `powershell -c "Add-Type -AssemblyName System.Windows.Forms; $notify = New-Object System.Windows.Forms.NotifyIcon; $notify.Icon = [System.Drawing.SystemIcons]::Information; $notify.Visible = $true; $notify.ShowBalloonTip(15000, '${title}', '${message}', [System.Windows.Forms.ToolTipIcon]::Warning)"`;
    execSync(popupCmd, { stdio: 'ignore' });
  } catch (e) {}
}

function scanForTasks() {
  console.log(`\n[${new Date().toLocaleTimeString()}] [antigravity-watcher] Scanning Canonical Queue for unblocked Ops missions...`);
  if (!fs.existsSync(TASK_FILE)) {
    console.log(`[antigravity-watcher] TASK_SEQUENCE.md not found. Waiting.`);
    return;
  }
  
  const content = fs.readFileSync(TASK_FILE, 'utf8');
  const taskBlocks = content.split('### T-').slice(1);
  
  let foundUnblockedTask = false;

  for (const block of taskBlocks) {
    const lines = block.split('\n');
    const taskId = `T-${lines[0].trim()}`;
    const statusLine = lines.find(l => l.startsWith('- Status:'));
    const ownerLine = lines.find(l => l.startsWith('- Owner:'));
    const blockedLine = lines.find(l => l.startsWith('- Labels:') || l.startsWith('- Blocker:'));

    const isAntigravity = ownerLine && ownerLine.includes('@antigravity');
    const isQueued = statusLine && statusLine.includes('`queued`');
    const isBlocked = blockedLine && (blockedLine.includes('blocked:yes') || blockedLine.includes('blocked: soft'));
    
    if (isAntigravity && isQueued && !isBlocked) {
      foundUnblockedTask = true;
      console.log(`\n======================================================`);
      console.log(`🚨 [ANTIGRAVITY TASK UNBLOCKED]: ${taskId}`);
      console.log(`======================================================\n`);
      
      notifyUser('Antigravity Ops Trigger', `Task ${taskId} is queued and unblocked. Please execute your AI agent to resolve it.`);
      break; 
    }
  }

  if (!foundUnblockedTask) {
    console.log(`[antigravity-watcher] Clear. Zero active, unblocked tasks. Going back to sleep for 2 minutes.`);
  }
}

// Initial scan
scanForTasks();

// Loop every 2 minutes
setInterval(scanForTasks, INTERVAL_MS);
console.log(`[antigravity-watcher] Drone online. Passive scanning active.`);
