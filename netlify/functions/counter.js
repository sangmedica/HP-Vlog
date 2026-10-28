const { getStore } = require('@netlify/blobs');

// トップページの右上に表示するアクセスカウンター用。
//   views    : 閲覧数   = HP内のページを開いた回数の累計
//   visitors : 訪問者数 = 初めて来たブラウザの累計（同じブラウザは一度だけ）
// 個人情報(IPアドレス等)は保存せず、数値2つだけを1件のデータとして持つ。

const STORE_NAME = 'site-counter';
const KEY = 'totals';

function getCounterStore() {
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
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify(obj)
  };
}

function normalize(totals) {
  const t = totals && typeof totals === 'object' ? totals : {};
  return {
    views: Number.isFinite(t.views) && t.views > 0 ? Math.floor(t.views) : 0,
    visitors: Number.isFinite(t.visitors) && t.visitors > 0 ? Math.floor(t.visitors) : 0
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, {});
  }

  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const store = getCounterStore();
  const totals = normalize(await store.get(KEY, { type: 'json' }));

  if (event.httpMethod === 'GET') {
    return jsonResponse(200, totals);
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return jsonResponse(400, { error: 'Invalid JSON' });
  }

  totals.views += 1;
  if (body.newVisitor === true) totals.visitors += 1;
  await store.setJSON(KEY, totals);

  return jsonResponse(200, totals);
};
