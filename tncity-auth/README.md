# TN CITY ROLEPLAY — CFW Edition
## نظام تسجيل الدخول عبر Discord OAuth2

---

## 📁 هيكل المشروع

```
tncity-auth/
├── server.js              ← السيرفر الرئيسي
├── package.json           ← المكتبات
├── .env.example           ← قالب الإعدادات (اسمّه .env)
├── .gitignore
└── public/
    ├── index.html         ← الموقع الرئيسي
    ├── login.html         ← صفحة تسجيل الدخول
    ├── dashboard.html     ← لوحة تحكم المستخدم
    └── logo.webp          ← الشعار
```

---

## ⚡ خطوات التشغيل

### 1. إعداد ملف .env
```bash
cp .env.example .env
```
افتح `.env` وعدّل القيم:
```env
DISCORD_CLIENT_ID=1480416371614552145
DISCORD_CLIENT_SECRET=ضع_الـ_secret_الجديد_هنا
DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback
DISCORD_GUILD_ID=ضع_server_id_هنا
SESSION_SECRET=tncity_super_secret_2025
PORT=3000
```

### 2. تثبيت المكتبات
```bash
npm install
```

### 3. تشغيل السيرفر
```bash
npm start
```

### 4. Discord Developer Portal
روح لـ https://discord.com/developers/applications
- اختر تطبيقك
- OAuth2 → Redirects
- أضف: `http://localhost:3000/auth/callback`

---

## 🌐 الروابط

| الصفحة | الرابط |
|--------|--------|
| الموقع الرئيسي | http://localhost:3000 |
| تسجيل الدخول | http://localhost:3000/login |
| لوحة التحكم | http://localhost:3000/dashboard |
| بيانات المستخدم (API) | http://localhost:3000/api/me |
| تسجيل الخروج | http://localhost:3000/auth/logout |

---

## 🚀 النشر على Replit

1. أنشئ Repl جديد (Node.js)
2. ارفع الملفات
3. في **Secrets** أضف متغيرات الـ .env
4. غيّر `DISCORD_REDIRECT_URI` لرابط Replit
5. أضف نفس الرابط في Discord Developer Portal
6. اضغط Run ✅

