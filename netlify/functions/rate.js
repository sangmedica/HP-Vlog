const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'blog-ratings';

function getRatingsStore() {
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

function average(data) {
  if (!data || !data.count) return 0;
  return data.sum / data.count;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, {});
  }

  const store = getRatingsStore();

  if (event.httpMethod === 'GET') {
    const slug = event.queryStringParameters && event.queryStringParameters.slug;

    if (slug) {
      const data = (await store.get(slug, { type: 'json' })) || { sum: 0, count: 0 };
      return jsonResponse(200, { slug: slug, average: average(data), count: data.count });
    }

    const { blobs } = await store.list();
    const result = {};
    await Promise.all(
      blobs.map(async (b) => {
        const data = (await store.get(b.key, { type: 'json' })) || { sum: 0, count: 0 };
        result[b.key] = { average: average(data), count: data.count };
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
    const rating = Number(body.rating);

    if (!slug || typeof slug !== 'string' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return jsonResponse(400, { error: 'Invalid slug or rating' });
    }

    const current = (await store.get(slug, { type: 'json' })) || { sum: 0, count: 0 };
    const updated = { sum: current.sum + rating, count: current.count + 1 };
    await store.setJSON(slug, updated);

    return jsonResponse(200, { slug: slug, average: average(updated), count: updated.count });
  }

  return jsonResponse(405, { error: 'Method not allowed' });
};
