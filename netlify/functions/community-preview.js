const content = require('../../community/content.json');

// パスワード保護エリア(content.json)に掲載しているアプリの「どんなアプリか」だけを
// 一般公開するための読み取り専用エンドポイント。url・apkUrl・slug・category等の
// 実際にアプリへアクセスできてしまう情報は一切含めない(タイトル・説明・動画のみ)。

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: '{}' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apps = Array.isArray(content.apps)
    ? content.apps.map(function (app) {
        return {
          title: app.title || '',
          description: app.description || '',
          video: app.video || ''
        };
      })
    : [];

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apps: apps })
  };
};
