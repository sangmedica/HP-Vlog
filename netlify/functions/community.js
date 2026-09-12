const content = require('../../community/content.json');

function jsonResponse(statusCode, obj) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, {});
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return jsonResponse(400, { error: 'Invalid JSON' });
  }

  const expected = process.env.COMMUNITY_PASSWORD;

  if (!expected || typeof body.password !== 'string' || body.password !== expected) {
    return jsonResponse(401, { error: 'Invalid password' });
  }

  return jsonResponse(200, withAccessToken(content));
};

// 各アプリのURLに秘密トークンを付与し、アプリ側(Netlify Edge Function)で
// SANGMEDICAのこのページを経由したアクセスかどうかを検証できるようにする。
// SANGMEDICA_ACCESS_TOKEN は各アプリのNetlifyサイトにも同じ値で設定すること。
function withAccessToken(data) {
  const token = process.env.SANGMEDICA_ACCESS_TOKEN;
  if (!token || !Array.isArray(data.apps)) return data;

  return Object.assign({}, data, {
    apps: data.apps.map(function (app) {
      if (!app.url) return app;
      const sep = app.url.indexOf('?') === -1 ? '?' : '&';
      return Object.assign({}, app, {
        url: app.url + sep + 'sgmToken=' + encodeURIComponent(token)
      });
    })
  });
}
