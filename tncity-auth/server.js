require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// ════════════════════════════════════════
//  Middleware
// ════════════════════════════════════════
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'tncity_fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       // غيّرها true لو عندك HTTPS
    maxAge: 24 * 60 * 60 * 1000  // 24 ساعة
  }
}));

// ════════════════════════════════════════
//  Discord Constants
// ════════════════════════════════════════
const DISCORD_API     = 'https://discord.com/api/v10';
const CLIENT_ID       = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET   = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI    = process.env.DISCORD_REDIRECT_URI;
const GUILD_ID        = process.env.DISCORD_GUILD_ID; // ID سيرفر الديسكورد (اختياري)
const SCOPES          = 'identify guilds';

// ════════════════════════════════════════
//  Middleware: تحقق من تسجيل الدخول
// ════════════════════════════════════════
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'غير مسجل الدخول', redirect: '/' });
  }
  next();
}

// ════════════════════════════════════════
//  Route 1: بدء تسجيل الدخول عبر Discord
// ════════════════════════════════════════
app.get('/auth/discord', (req, res) => {
  const params = new URLSearchParams({
    client_id:     CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    response_type: 'code',
    scope:         SCOPES,
    prompt:        'none'  // لو المستخدم وافق قبل ما يطلب تأكيد
  });
  res.redirect(`https://discord.com/oauth2/authorize?${params}`);
});

// ════════════════════════════════════════
//  Route 2: Callback — بعد موافقة المستخدم
// ════════════════════════════════════════
app.get('/auth/callback', async (req, res) => {
  const { code, error } = req.query;

  // لو المستخدم رفض
  if (error) {
    console.log('User denied access:', error);
    return res.redirect('/?error=denied');
  }

  if (!code) {
    return res.redirect('/?error=no_code');
  }

  try {
    // ── الخطوة 1: تبادل الـ code بـ access_token ──
    const tokenRes = await axios.post(
      `${DISCORD_API}/oauth2/token`,
      new URLSearchParams({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type:    'authorization_code',
        code:          code,
        redirect_uri:  REDIRECT_URI
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const { access_token, refresh_token, token_type, expires_in } = tokenRes.data;

    // ── الخطوة 2: جلب بيانات المستخدم ──
    const userRes = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `${token_type} ${access_token}` }
    });

    const user = userRes.data;

    // ── الخطوة 3: جلب السيرفرات (اختياري) ──
    let guilds = [];
    try {
      const guildsRes = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
        headers: { Authorization: `${token_type} ${access_token}` }
      });
      guilds = guildsRes.data;
    } catch (e) {
      console.log('Could not fetch guilds:', e.message);
    }

    // ── الخطوة 4: تحقق من عضوية سيرفر TN CITY ──
    const isMember = GUILD_ID
      ? guilds.some(g => g.id === GUILD_ID)
      : true; // لو ما ضبطت GUILD_ID يتجاوز التحقق

    // ── الخطوة 5: بناء صورة الأفاتار ──
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`;

    // ── الخطوة 6: تخزين البيانات في Session ──
    req.session.user = {
      id:           user.id,
      username:     user.username,
      displayName:  user.global_name || user.username,
      discriminator:user.discriminator,
      avatar:       avatarUrl,
      email:        user.email || null,
      verified:     user.verified || false,
      isMember:     isMember,
      accessToken:  access_token,
      refreshToken: refresh_token,
      loginAt:      new Date().toISOString()
    };

    console.log(`✅ Login: ${user.username} (${user.id})`);

    // توجيه للداشبورد
    res.redirect('/dashboard');

  } catch (err) {
    console.error('OAuth2 Error:', err.response?.data || err.message);
    res.redirect('/?error=auth_failed');
  }
});

// ════════════════════════════════════════
//  Route 3: API — بيانات المستخدم الحالي
// ════════════════════════════════════════
app.get('/api/me', requireAuth, (req, res) => {
  // إرجاع البيانات بدون access_token للأمان
  const { accessToken, refreshToken, ...safeUser } = req.session.user;
  res.json(safeUser);
});

// ════════════════════════════════════════
//  Route 4: تسجيل الخروج
// ════════════════════════════════════════
app.get('/auth/logout', (req, res) => {
  const username = req.session.user?.username || 'Unknown';
  req.session.destroy(err => {
    if (err) console.error('Session destroy error:', err);
    console.log(`👋 Logout: ${username}`);
    res.redirect('/');
  });
});

// ════════════════════════════════════════
//  Route 5: صفحة Dashboard
// ════════════════════════════════════════
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ════════════════════════════════════════
//  Route 6: الصفحة الرئيسية
// ════════════════════════════════════════
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ════════════════════════════════════════
//  Error Handler
// ════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'خطأ في السيرفر' });
});

// ════════════════════════════════════════
//  Start Server
// ════════════════════════════════════════
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║     TN CITY ROLEPLAY — Auth Server   ║');
  console.log(`║     Running on port: ${PORT}              ║`);
  console.log('╚══════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 Local:   http://localhost:${PORT}`);
  console.log(`🔑 Login:   http://localhost:${PORT}/auth/discord`);
  console.log(`📊 API:     http://localhost:${PORT}/api/me`);
  console.log('');
});
