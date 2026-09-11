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

  return jsonResponse(200, content);
};
