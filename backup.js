import {readBackup, restoreBackup, validateBackup} from './backup-model.mjs';
const field = document.querySelector('#backup-text');
const status = document.querySelector('#backup-status');
document.querySelector('#export-backup').onclick = () => {
  try {
    field.value = JSON.stringify(readBackup(localStorage));
    field.focus(); field.select();
    status.textContent = 'Backup ready. Copy all the selected text. Paste it into the Home Screen app’s Backup text field.';
  } catch {
    status.textContent = 'Could not create a backup. Saved data may be unreadable or storage unavailable. Do not clear your browser data.';
  }
};
document.querySelector('#restore-backup').onclick = () => {
  try {
    if (field.value.length > 5000000) throw new Error('This backup is too large.');
    let data;
    try { data = JSON.parse(field.value); } catch { throw new Error('Paste the complete backup text first.'); }
    validateBackup(data);
    if (!confirm(`Restore ${data.habits.length} habits and ${data.goals.length} goals? Existing entries with the same ID will be kept. The app will reload.`)) return;
    restoreBackup(localStorage, data);
    location.reload();
  } catch (error) {
    status.textContent = `Could not restore: ${error.message}`;
  }
};
