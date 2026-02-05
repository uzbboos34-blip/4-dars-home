# 4-DARS Loyihasi

## 📋 O'rnatish

```bash
# 1. Barcha paketlarni o'rnatish
node install-backend.js

# 2. Asosiy server ishga tushirish
npm start
```

## 🚀 Ishlatish

**Development muhitida:**
```bash
npm start
```

Server ishga tushadi:
- 🎨 **Frontend**: http://localhost:3000/frontend
- 🔵 **Backend API**: http://localhost:3000/backend
- 📍 **Main**: http://localhost:3000

## 📁 Struktura

```
.
├── main.js                 # Reverse proxy va main server
├── install-backend.js      # Backend paketlarini o'rnatish
├── .env                    # Environment o'zgaruvchilari
├── package.json           # Root dependencies
├── backend/
│   ├── src/
│   │   ├── server.js      # Backend server
│   │   └── database/
│   │       └── sqlite.js  # SQLite database
│   └── package.json
└── frontend/
    ├── server.js          # Frontend server
    └── package.json
```

## 🗄️ Database

SQLite database `data.db` faylida saqlanadi. Git orqali sync qilinadi.

**Jadvallar:**
- `users` - Foydalanuvchilar
- `files` - Fayllar
- `messages` - Xabarlar

## 🌐 Server Deploy

Render.com da deploy qilinganida:
- `npm start` buyrugini ishga tushiring
- Port avtomatik 10000 ga o'tadi
- Frontend: https://your-domain.onrender.com/frontend
- Backend: https://your-domain.onrender.com/backend
