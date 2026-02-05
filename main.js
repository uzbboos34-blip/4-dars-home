import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backend, frontend;

// Paketlarni o'rnatish
function installDependencies() {
  console.log('📦 Backend paketlari o\'rnatilmoqda...');
  
  return new Promise((resolve) => {
    const backendInstall = spawn('npm', ['install'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'inherit',
      shell: true
    });

    backendInstall.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Backend paketlari o\'rnatildi\n');
        console.log('📦 Frontend paketlari o\'rnatilmoqda...');
        
        const frontendInstall = spawn('npm', ['install'], {
          cwd: path.join(__dirname, 'frontend'),
          stdio: 'inherit',
          shell: true
        });

        frontendInstall.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Frontend paketlari o\'rnatildi\n');
            resolve();
          }
        });
      }
    });
  });
}

// Dev serverlarni ishga tushirish
async function startServers() {
  await installDependencies();
  
  console.log('🚀 Frontend va Backend ishga tushmoqda...\n');

  // Backend ishga tushirish
  backend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true
  });

  // Frontend ishga tushirish
  frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true
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

startServers().catch(console.error);
