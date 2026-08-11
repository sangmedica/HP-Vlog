exports.handler = async (event) => {
  const { GITHUB_CLIENT_ID } = process.env;
  const host = event.headers['x-forwarded-host'] || event.headers.host;
  const origin = `https://${host}`;
  const redirectUri = `${origin}/.netlify/functions/callback`;

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'repo,user'
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params.toString()}`
    },
    body: ''
  };
};
