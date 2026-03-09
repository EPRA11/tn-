<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>TN CITY — لوحة التحكم</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Poppins',sans-serif;background:#050505;color:#e8d5ff;min-height:100vh}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 50% at 10% 10%,rgba(176,38,255,0.12) 0%,transparent 60%),radial-gradient(ellipse 60% 70% at 90% 90%,rgba(75,0,130,0.15) 0%,transparent 60%),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(176,38,255,0.015) 60px,rgba(176,38,255,0.015) 61px);pointer-events:none;z-index:0}
nav{position:sticky;top:0;z-index:100;background:rgba(5,5,5,0.88);backdrop-filter:blur(20px);border-bottom:1px solid rgba(176,38,255,0.2);padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-logo{font-family:'Orbitron',sans-serif;font-size:16px;font-weight:900;color:#fff;letter-spacing:3px;text-decoration:none}
.nav-logo span{color:#b026ff}
.nav-right{display:flex;align-items:center;gap:12px}
.nav-avatar{width:38px;height:38px;border-radius:50%;border:2px solid rgba(176,38,255,0.5);object-fit:cover}
.nav-name{font-size:14px;font-weight:600;color:#e8d5ff}
.btn-logout{background:rgba(255,50,50,0.1);border:1px solid rgba(255,50,50,0.3);color:#ff8888;font-size:12px;padding:6px 14px;border-radius:8px;cursor:pointer;text-decoration:none;transition:all .2s}
.btn-logout:hover{background:rgba(255,50,50,0.2)}
main{max-width:900px;margin:0 auto;padding:40px 20px 80px;position:relative;z-index:2}
.glass{background:rgba(75,0,130,0.1);backdrop-filter:blur(16px);border:1px solid rgba(176,38,255,0.22);border-radius:16px;padding:30px;position:relative;overflow:hidden;margin-bottom:20px}
.glass::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(176,38,255,0.6),transparent)}
.welcome{display:flex;align-items:center;gap:22px}
.welcome-avatar{width:84px;height:84px;border-radius:50%;border:3px solid rgba(176,38,255,0.6);box-shadow:0 0 25px rgba(176,38,255,0.4);object-fit:cover;flex-shrink:0}
.welcome h2{font-family:'Orbitron',sans-serif;font-size:18px;color:#fff;margin-bottom:6px}
.welcome p{font-size:13px;color:#a08abf;margin-bottom:8px}
.badge{display:inline-flex;align-items:center;gap:6px;font-size:12px;padding:4px 12px;border-radius:8px}
.badge-green{background:rgba(50,255,100,0.1);border:1px solid rgba(50,255,100,0.3);color:#66ff99}
.badge-orange{background:rgba(255,150,0,0.1);border:1px solid rgba(255,150,0,0.3);color:#ffaa33}
.section-title{font-family:'Orbitron',sans-serif;font-size:13px;font-weight:700;color:#fff;letter-spacing:3px;margin-bottom:18px;display:flex;align-items:center;gap:10px}
.section-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(176,38,255,0.4),transparent)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;margin-bottom:20px}
.card{background:rgba(75,0,130,0.08);border:1px solid rgba(176,38,255,0.18);border-radius:12px;padding:20px;transition:all .3s;text-decoration:none;color:#e8d5ff;display:block}
.card:hover{border-color:rgba(176,38,255,0.5);transform:translateY(-4px);box-shadow:0 10px 25px rgba(176,38,255,0.15)}
.card-icon{font-size:28px;margin-bottom:10px}
.card-title{font-family:'Orbitron',sans-serif;font-size:11px;font-weight:700;color:#fff;letter-spacing:2px;margin-bottom:6px}
.card-body{font-size:12px;color:#a08abf;line-height:1.6}
.info-table{width:100%;border-collapse:collapse;font-size:14px}
.info-table td{padding:11px 12px;border-bottom:1px solid rgba(176,38,255,0.1)}
.info-table td:first-child{color:#a08abf;width:38%}
.info-table td:last-child{color:#e8d5ff;font-weight:500}
#loading{position:fixed;inset:0;background:rgba(5,5,5,0.97);display:flex;align-items:center;justify-content:center;z-index:999;flex-direction:column;gap:14px}
.spinner{width:44px;height:44px;border:3px solid rgba(176,38,255,0.2);border-top-color:#b026ff;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
</style>
</head>
<body>
<div id="loading">
  <div class="spinner"></div>
  <p style="font-family:'Orbitron',sans-serif;font-size:11px;color:#b026ff;letter-spacing:4px;">جاري التحميل...</p>
</div>
<nav>
  <a href="/" class="nav-logo">TN <span>CITY</span> RP</a>
  <div class="nav-right">
    <img id="nav-avatar" class="nav-avatar" src="" alt="">
    <span id="nav-name" class="nav-name"></span>
    <a href="/.netlify/functions/auth-logout" class="btn-logout">🚪 خروج</a>
  </div>
</nav>
<main>
  <div class="glass">
    <div class="welcome">
      <img id="w-avatar" class="welcome-avatar" src="" alt="">
      <div>
        <h2 id="w-name">أهلاً!</h2>
        <p id="w-id" style="font-size:12px;color:#6a4a88;margin-bottom:4px;"></p>
        <p>مرحباً بك في لوحة تحكم TN CITY ROLEPLAY</p>
        <div id="w-status" style="margin-top:10px;"></div>
      </div>
    </div>
  </div>
  <div class="glass">
    <div class="section-title">👤 بيانات الحساب</div>
    <table class="info-table">
      <tr><td>اسم المستخدم</td><td id="t-user">—</td></tr>
      <tr><td>الاسم المعروض</td><td id="t-display">—</td></tr>
      <tr><td>Discord ID</td><td id="t-id">—</td></tr>
      <tr><td>عضو السيرفر</td><td id="t-member">—</td></tr>
      <tr><td>تاريخ الدخول</td><td id="t-login">—</td></tr>
    </table>
  </div>
  <div class="section-title" style="font-family:'Orbitron',sans-serif;font-size:13px;font-weight:700;color:#fff;letter-spacing:3px;margin-bottom:16px;">🚀 روابط سريعة</div>
  <div class="grid">
    <a href="https://cfx.re/join/eqd33d" target="_blank" class="card"><div class="card-icon">🎮</div><div class="card-title">سيرفر FiveM</div><div class="card-body">انضم وابدأ الروليبلاي</div></a>
    <a href="https://discord.gg/By7vpHs6ry" target="_blank" class="card"><div class="card-icon">💬</div><div class="card-title">ديسكورد</div><div class="card-body">تواصل مع المجتمع</div></a>
    <a href="https://discord.gg/E6Cg267fQ6" target="_blank" class="card"><div class="card-icon">👮</div><div class="card-title">تقديم شرطة</div><div class="card-body">قدّم على وظيفة الشرطة</div></a>
    <a href="https://discord.gg/CUYqferKga" target="_blank" class="card"><div class="card-icon">🏥</div><div class="card-title">تقديم EMS</div><div class="card-body">قدّم على وزارة الصحة</div></a>
    <a href="/" class="card"><div class="card-icon">📋</div><div class="card-title">القوانين</div><div class="card-body">قوانين TN CITY CFW</div></a>
    <a href="https://www.tiktok.com/@qm5w" target="_blank" class="card"><div class="card-icon">📱</div><div class="card-title">TikTok</div><div class="card-body">تابعنا على تيك توك</div></a>
  </div>
</main>
<script>
fetch('/.netlify/functions/api-me')
  .then(r=>{ if(!r.ok) throw new Error(); return r.json(); })
  .then(u=>{
    document.getElementById('loading').style.display='none';
    document.getElementById('nav-avatar').src=u.avatar;
    document.getElementById('nav-name').textContent=u.displayName||u.username;
    document.getElementById('w-avatar').src=u.avatar;
    document.getElementById('w-name').textContent='أهلاً، '+(u.displayName||u.username)+' 👋';
    document.getElementById('w-id').textContent='Discord ID: '+u.id;
    document.getElementById('w-status').innerHTML=u.isMember
      ?'<span class="badge badge-green">✅ عضو في سيرفر TN CITY</span>'
      :'<span class="badge badge-orange">⚠️ لست عضواً في السيرفر بعد</span>';
    document.getElementById('t-user').textContent='@'+u.username;
    document.getElementById('t-display').textContent=u.displayName||u.username;
    document.getElementById('t-id').textContent=u.id;
    document.getElementById('t-member').textContent=u.isMember?'✅ نعم':'❌ لا';
    document.getElementById('t-login').textContent=new Date(u.loginAt).toLocaleString('ar-IQ');
  })
  .catch(()=>{ window.location.href='/'; });
</script>
</body>
</html>