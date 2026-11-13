// 各アプリ（保護エリアのアプリ）のログイン画面から呼ばれる、パスワード照合用の関数。
// アプリ側のゲート（gate.js v2）が、利用者の入力したパスワードをここへ送って確認する。
// - 呼び出せるのは、秘密トークン SANGMEDICA_ACCESS_TOKEN をヘッダー X-Sgm-Token に付けた、各アプリのゲートだけ
// - パスワードは COMMUNITY_PASSWORD（コミュニティページと同じ）。パスワードを毎月変更するときは、この環境変数だけを変える
// - 失敗が続いたクライアントIPは一定時間ロックする（このサーバーレス関数のインスタンス内での、ベストエフォートの制限）
const crypto = require('crypto');

const MAX_FAILS = 8;
const LOCK_MS = 10 * 60 * 1000;
const fails = new Map(); // ip -> { n, until }

function json(statusCode, obj) {
  return { statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(obj) };
}
function sha(s) { return crypto.createHash('sha256').update(String(s)).digest(); }
function same(a, b) { return crypto.timingSafeEqual(sha(a), sha(b)); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const token = process.env.SANGMEDICA_ACCESS_TOKEN;
  const given = event.headers['x-sgm-token'] || '';
  if (!token || !same(given, token)) return json(403, { error: 'Forbidden' });

  const expected = process.env.COMMUNITY_PASSWORD;
  if (!expected) return json(503, { error: 'Not configured' });

  const ip = String(event.headers['x-sgm-client'] || 'unknown').slice(0, 64);
  const now = Date.now();
  const rec = fails.get(ip);
  if (rec && rec.until > now) return json(429, { error: 'Too many attempts' });

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Invalid JSON' }); }
  const password = typeof body.password === 'string' ? body.password : '';

  if (password && same(password, expected)) {
    fails.delete(ip);
    return json(200, { ok: true });
  }

  const prev = rec ? (rec.until && rec.until <= now ? 0 : rec.n) : 0;   // ロック期間が過ぎていたら、失敗回数を数え直す
  const next = prev + 1;
  fails.set(ip, next >= MAX_FAILS ? { n: 0, until: now + LOCK_MS } : { n: next, until: 0 });
  if (fails.size > 5000) fails.clear();
  await sleep(400);
  return json(401, { error: 'Invalid password' });
};
