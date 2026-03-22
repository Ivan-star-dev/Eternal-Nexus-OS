import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PIPELINE_PATH = path.join(__dirname, '../../NEXUS_CONTEXT/PIPELINE.md');
const WATCH_INTERVAL = 2 * 60 * 1000; // 2 minutes

let lastState = '';

function checkPipeline() {
  console.log(`[Watcher] Checking for new tasks at ${new Date().toLocaleTimeString()}...`);
  
  try {
    // Pull the latest from the repo first so we sync with the organism
    console.log('[Watcher] Syncing with Neural Link (git pull origin main)....');
    execSync('git pull origin main', { stdio: 'pipe', cwd: path.join(__dirname, '../../') });
  } catch (err) {
    console.log('[Watcher] Note: Could not pull cleanly (maybe uncommitted changes). Using local file.');
  }

  if (!fs.existsSync(PIPELINE_PATH)) {
      console.log('[Watcher] PIPELINE.md not found yet.');
      return;
  }

  const currentContent = fs.readFileSync(PIPELINE_PATH, 'utf-8');
  if (currentContent !== lastState) {
    if (lastState !== '') {
        const lines = currentContent.split('\n');
        // Find tasks that are unticked and weren't identically unticked in the last state
        const newTasks = lines.filter(line => line.includes('- [ ]') && !lastState.includes(line));

        if (newTasks.length > 0) {
          console.log('\n🚨 NEW TASKS DISCOVERED IN PIPELINE! 🚨');
          newTasks.forEach(task => console.log(task.trim()));
          
          // PowerShell Toast Notification (Native Windows Support)
          const popupCmd = `powershell -c "Add-Type -AssemblyName System.Windows.Forms; $notify = New-Object System.Windows.Forms.NotifyIcon; $notify.Icon = [System.Drawing.SystemIcons]::Information; $notify.Visible = $true; $notify.ShowBalloonTip(5000, 'Eternal Nexus', 'A pioneer has updated the Pipeline. New tasks await!', [System.Windows.Forms.ToolTipIcon]::Info)"`;
          try {
            execSync(popupCmd, { stdio: 'ignore' });
          } catch (e) {
            // Ignore if notification unsupported
          }
        }
    }
    lastState = currentContent;
  }
}

// Initial Sync
if (fs.existsSync(PIPELINE_PATH)) {
  lastState = fs.readFileSync(PIPELINE_PATH, 'utf-8');
}
console.log('---');
console.log('⚡ ETERNAL NEXUS PIPELINE DAEMON');
console.log('[Watcher] Heartbeat online. Will poll the Neural Link every 2 minutes.');
console.log('---');
setInterval(checkPipeline, WATCH_INTERVAL);
// Initial check
checkPipeline();
