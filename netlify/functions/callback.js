exports.handler = async (event) => {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  const code = event.queryStringParameters && event.queryStringParameters.code;
  const provider = 'github';

  if (!code) {
    return { statusCode: 400, body: 'Missing code parameter' };
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      })
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return {
        statusCode: 401,
        body: 'GitHub OAuth error: ' + (tokenData.error_description || tokenData.error)
      };
    }

    const payload = JSON.stringify({ token: tokenData.access_token, provider: provider });

    const html = `<!DOCTYPE html>
<html>
<body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:${provider}:success:${payload.replace(/'/g, "\\'")}',
      e.origin
    );
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:${provider}', '*');
})();
</script>
</body>
</html>`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html
    };
  } catch (err) {
    return { statusCode: 500, body: 'Error exchanging code: ' + err.message };
  }
};
