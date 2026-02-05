import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📦 Backend paketlari o\'rnatilmoqda...\n');

const backendInstall = spawn('npm', ['install'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

backendInstall.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Backend paketlari muvaffaqiyatli o\'rnatildi!');
    process.exit(0);
  } else {
    console.log('\n❌ Backend paketlari o\'rnatishda xatolik!');
    process.exit(1);
  }
});

backendInstall.on('error', (err) => {
  console.error('❌ Xatolik:', err);
  process.exit(1);
});
