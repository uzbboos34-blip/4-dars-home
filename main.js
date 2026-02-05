import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backend, frontend;
const app = express();

const MAIN_PORT = process.env.PORT || 3000;
const BACKEND_INTERNAL_PORT = process.env.BACKEND_PORT || 4545;
const FRONTEND_INTERNAL_PORT = process.env.FRONTEND_PORT || 9090;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

console.log(`🌍 Environment: ${NODE_ENV}`);

// Dev serverlarni ishga tushirish (faqat development'da)
function startServers() {
  if (IS_PRODUCTION) {
    console.log('📍 Production mode: Backend va Frontend alohida chalashtirilyapti...\n');
    return;
  }
  
  console.log('🚀 Development mode: Backend va Frontend ishga tushmoqda...\n');

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
if (IS_PRODUCTION) {
  // Production: backend ga proxy, frontend static fayllarni serve
  app.use(express.static(path.join(__dirname, 'frontend', 'public')));
  app.use(express.static(path.join(__dirname, 'frontend', 'html')));
  
  // Frontend HTML fayllarni serve qil
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'index.html'));
  });
  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'login.html'));
  });
  app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'register.html'));
  });
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'admin.html'));
  });
} else {
  // Development: proxy to dev servers
  app.use('/frontend', createProxyMiddleware({
    target: `http://localhost:${FRONTEND_INTERNAL_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      '^/frontend': '/'
    }
  }));
}

// Backend API proxy (both dev and prod)
app.use('/backend', createProxyMiddleware({
  target: `http://localhost:${BACKEND_INTERNAL_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/backend': '/'
  },
  ws: true
}));

// Default route
app.get('/', (req, res) => {
  if (!IS_PRODUCTION) {
    res.json({
      message: 'Xush kelibsiz! (Development)',
      frontend: '/frontend',
      backend: '/backend'
    });
  }
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
app.listen(MAIN_PORT, '0.0.0.0', () => {
  console.log(`\n✅ Main server ishga tushdi: Port ${MAIN_PORT}`);
  if (!IS_PRODUCTION) {
    console.log(`🎨 Frontend: http://localhost:${MAIN_PORT}/frontend`);
  }
  console.log(`🔵 Backend API: /backend`);
});
