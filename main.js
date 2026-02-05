import express from 'express';
import { createProxyMiddleware } from 'express-http-proxy';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backend, frontend;
const app = express();

const MAIN_PORT = process.env.PORT || 3000;
const BACKEND_INTERNAL_PORT = 4545;
const FRONTEND_INTERNAL_PORT = 9090;

// Dev serverlarni ishga tushirish
function startServers() {
  console.log('🚀 Backend va Frontend ishga tushmoqda...\n');

  // Backend ishga tushirish
  backend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: BACKEND_INTERNAL_PORT }
  });

  // Frontend ishga tushirish
  frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: FRONTEND_INTERNAL_PORT }
  });

  backend.on('error', (err) => {
    console.error('❌ Backend xatosi:', err);
  });

  frontend.on('error', (err) => {
    console.error('❌ Frontend xatosi:', err);
  });
}

// Reverse Proxy sozlamalari
app.use('/backend', createProxyMiddleware({
  target: `http://localhost:${BACKEND_INTERNAL_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/backend': '/'
  },
  ws: true
}));

app.use('/frontend', createProxyMiddleware({
  target: `http://localhost:${FRONTEND_INTERNAL_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/frontend': '/'
  }
}));

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Xush kelibsiz!',
    frontend: '/frontend',
    backend: '/backend'
  });
});

// Process yopilganini boshqarish
process.on('SIGINT', () => {
  console.log('\n\n⛔ Ishni to\'xtatmoqda...');
  if (backend) backend.kill();
  if (frontend) frontend.kill();
  process.exit(0);
});

startServers();

// Main server ishga tushirish
app.listen(MAIN_PORT, () => {
  console.log(`\n✅ Main server ishga tushdi: http://localhost:${MAIN_PORT}`);
  console.log(`🎨 Frontend: http://localhost:${MAIN_PORT}/frontend`);
  console.log(`🔵 Backend: http://localhost:${MAIN_PORT}/backend`);
});
