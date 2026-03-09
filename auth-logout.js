const https = require('https');

// Helper: HTTP POST with URLSearchParams
function httpPost(url, params) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams(params).toString();
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('JSON parse error: ' + data)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Helper: HTTP GET with Authorization header
function httpGet(url, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: { Authorization: token }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('JSON parse error')); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

exports.handler = async (event, context) => {
  const { code, error } = event.queryStringParameters || {};

  // User denied
  if (error) {
    return { statusCode: 302, headers: { Location: '/?error=denied' }, body: '' };
  }
  if (!code) {
    return { statusCode: 302, headers: { Location: '/?error=no_code' }, body: '' };
  }

  const CLIENT_ID     = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const REDIRECT_URI  = process.env.DISCORD_REDIRECT_URI;
  const GUILD_ID      = process.env.DISCORD_GUILD_ID;
  const DISCORD_API   = 'https://discord.com/api/v10';

  try {
    // ── Step 1: Exchange code for token ──
    const tokenData = await httpPost(`${DISCORD_API}/oauth2/token`, {
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type:    'authorization_code',
      code,
      redirect_uri:  REDIRECT_URI
    });

    if (tokenData.error) {
      console.error('Token error:', tokenData);
      return { statusCode: 302, headers: { Location: '/?error=auth_failed' }, body: '' };
    }

    const { access_token, token_type } = tokenData;
    const authHeader = `${token_type} ${access_token}`;

    // ── Step 2: Get user info ──
    const user = await httpGet(`${DISCORD_API}/users/@me`, authHeader);

    // ── Step 3: Get guilds ──
    let isMember = true;
    if (GUILD_ID) {
      try {
        const guilds = await httpGet(`${DISCORD_API}/users/@me/guilds`, authHeader);
        isMember = Array.isArray(guilds) && guilds.some(g => g.id === GUILD_ID);
      } catch(e) {
        isMember = false;
      }
    }

    // ── Step 4: Build avatar URL ──
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`;

    // ── Step 5: Store user in cookie (JWT-style base64) ──
    const userData = {
      id:          user.id,
      username:    user.username,
      displayName: user.global_name || user.username,
      avatar:      avatarUrl,
      isMember,
      loginAt:     new Date().toISOString()
    };

    const userCookie = Buffer.from(JSON.stringify(userData)).toString('base64');

    console.log(`✅ Login: ${user.username} (${user.id})`);

    return {
      statusCode: 302,
      headers: {
        Location: '/dashboard.html',
        'Set-Cookie': `tncity_user=${userCookie}; Path=/; Max-Age=86400; SameSite=Lax`
      },
      body: ''
    };

  } catch(err) {
    console.error('OAuth Error:', err.message);
    return { statusCode: 302, headers: { Location: '/?error=auth_failed' }, body: '' };
  }
};
