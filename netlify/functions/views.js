const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'blog-views';

function getViewsStore() {
  // 自動設定されたBlobs実行コンテキストが見つからない環境向けに、
  // サイトIDとアクセストークンを使った手動設定にフォールバックする
  if (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    return getStore({
      name: STORE_NAME,
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN
    });
  }
  return getStore(STORE_NAME);
}

function jsonResponse(statusCode, obj) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify(obj)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, {});
  }

  const store = getViewsStore();

  if (event.httpMethod === 'GET') {
    const slug = event.queryStringParameters && event.queryStringParameters.slug;

    if (slug) {
      const count = (await store.get(slug, { type: 'json' })) || 0;
      return jsonResponse(200, { slug: slug, count: count });
    }

    const { blobs } = await store.list();
    const result = {};
    await Promise.all(
      blobs.map(async (b) => {
        result[b.key] = (await store.get(b.key, { type: 'json' })) || 0;
      })
    );
    return jsonResponse(200, result);
  }

  if (event.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return jsonResponse(400, { error: 'Invalid JSON' });
    }

    const slug = body.slug;
    if (!slug || typeof slug !== 'string') {
      return jsonResponse(400, { error: 'Invalid slug' });
    }

    const current = (await store.get(slug, { type: 'json' })) || 0;
    const updated = current + 1;
    await store.setJSON(slug, updated);

    return jsonResponse(200, { slug: slug, count: updated });
  }

  return jsonResponse(405, { error: 'Method not allowed' });
};
