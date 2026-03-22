import { exec, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getNextWakeTime() {
  const now = new Date();
  const target = new Date();
  
  // Set target to 07:00 AM local time (AMS)
  target.setHours(7, 0, 0, 0);

  // If we are already past 7 AM today, set for tomorrow 7 AM
  if (now.getTime() >= target.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  
  return target;
}

const targetTime = getNextWakeTime();
const timeToSleepMs = targetTime.getTime() - Date.now();
const minutesToSleep = Math.round(timeToSleepMs / 1000 / 60);

console.log(`=========================================`);
console.log(`[Hibernation Protocol] INITIATED`);
console.log(`[Hibernation Protocol] Organism is now dormant.`);
console.log(`[Hibernation Protocol] Auto-wake sequence programmed for: ${targetTime.toLocaleString()}`);
console.log(`[Hibernation Protocol] Time remaining: ${minutesToSleep} minutes.`);
console.log(`=========================================`);

setTimeout(() => {
  console.log(`\n=========================================`);
  console.log(`[Reveille] 07:00 AM AMS REACHED.`);
  console.log(`[Reveille] WAKING UP ALL PIONEERS (@claude, @codex, @copilot, @antigravity).`);
  console.log(`=========================================\n`);
  
  try {
    // 1. Send Windows Toast Notification
    const popupCmd = `powershell -c "Add-Type -AssemblyName System.Windows.Forms; $notify = New-Object System.Windows.Forms.NotifyIcon; $notify.Icon = [System.Drawing.SystemIcons]::Information; $notify.Visible = $true; $notify.ShowBalloonTip(10000, 'Eternal Nexus', '07:00 AM REVEILLE: The Organism is Awake. Pioneers are resuming work from the pipeline!', [System.Windows.Forms.ToolTipIcon]::Info)"`;
    execSync(popupCmd, { stdio: 'ignore' });
    
    // 2. Restart the pipeline daemon to resume picking up tasks
    console.log(`[Reveille] Engaging Universal Neural Link (watch:pipeline)...`);
    exec('cmd.exe /c npm run watch:pipeline', { cwd: path.join(__dirname, '../../') }, (err, stdout, stderr) => {
        if (err) console.error(err);
    });
    
  } catch (e) {
    console.error(`[Reveille] Boot sequence encountered resistance:`, e);
  }
}, timeToSleepMs);
