import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backend, frontend;

// Dev serverlarni ishga tushirish
function startServers() {
  console.log('🚀 Frontend va Backend ishga tushmoqda...\n');

  // Backend ishga tushirish
  backend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: process.env.BACKEND_PORT || 4545 }
  });

  // Frontend ishga tushirish
  frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: process.env.FRONTEND_PORT || 9090 }
  });

  // Process xatolarini boshqarish
  backend.on('error', (err) => {
    console.error('❌ Backend xatosi:', err);
  });

  frontend.on('error', (err) => {
    console.error('❌ Frontend xatosi:', err);
  });
}

// Process yopilganini boshqarish
process.on('SIGINT', () => {
  console.log('\n\n⛔ Ishni to\'xtatmoqda...');
  if (backend) backend.kill();
  if (frontend) frontend.kill();
  process.exit(0);
});

startServers();
