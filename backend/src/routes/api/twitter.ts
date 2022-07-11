import Router from '@koa/router';
import HttpStatus from 'http-status';
import koaBody from 'koa-body';

const twitterRouter = new Router({ prefix: '/twitter/oauth' });

// OAuth Step 1
twitterRouter.post('/request_token', async (ctx) => {
	const { oauth_token, oauth_token_secret } = await oauth.getOAuthRequestToken();

	ctx.cookies.set('oauth_token', oauth_token, {
		maxAge: 15 * 60 * 1000, // 15 minutes
		secure: true,
		httpOnly: true,
		sameSite: true,
	});

	tokens[oauth_token] = { oauth_token_secret };
	res.json({ oauth_token });
});

// OAuth Step 3
twitterRouter.post('/access_token', async (req, res) => {
	try {
		const { oauth_token: req_oauth_token, oauth_verifier } = req.body;
		const oauth_token = req.cookies[COOKIE_NAME];
		const { oauth_token_secret } = tokens[oauth_token];

		if (oauth_token !== req_oauth_token) {
			res.status(403).json({ message: 'Request tokens do not match' });
			return;
		}

		const { oauth_access_token, oauth_access_token_secret } = await oauth.getOAuthAccessToken(
			oauth_token,
			oauth_token_secret,
			oauth_verifier,
		);
		tokens[oauth_token] = { ...tokens[oauth_token], oauth_access_token, oauth_access_token_secret };
		res.json({ success: true });
	} catch (error) {
		res.status(403).json({ message: 'Missing access token' });
	}
});

// Authenticated resource access
twitterRouter.get('/twitter/users/profile_banner', async (req, res) => {
	try {
		const oauth_token = req.cookies[COOKIE_NAME];
		const { oauth_access_token, oauth_access_token_secret } = tokens[oauth_token];
		const response = await oauth.getProtectedResource(
			'https://api.twitter.com/1.1/account/verify_credentials.json',
			'GET',
			oauth_access_token,
			oauth_access_token_secret,
		);
		res.json(JSON.parse(response.data));
	} catch (error) {
		res.status(403).json({ message: 'Missing, invalid, or expired tokens' });
	}
});

export default twitterRouter;
