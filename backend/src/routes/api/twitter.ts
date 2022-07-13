/**
 * Route for Twitter oAuth
 * ---
 * GET: /api/twitter/oauth/request_token
 * Get oAuth Token
 * ---
 * POST: /api/twitter/oauth/access_token
 * Create Twitter API Client with posted credentials
 * ---
 */
import Router from '@koa/router';
import HttpStatus from 'http-status';
import koaBody from 'koa-body';
import { initializeAuthorization, completeLogin } from '../../twitter';
import { requestToken } from '../../controllers/twitter-auth-controller';

const twitterAuthRouter = new Router({ prefix: '/twitter/oauth' });

// OAuth Step 1
/*
twitterAuthRouter.get('/request_token', async (ctx) => {
	// callback url is set in the "Twitter Developer" portal, under "App settings"
	// it must be an exact match otherwise you will get a 415 error "Callback URL not approved..."
	const callbackUrl = 'http://localhost:3000';
	const oauthToken = await initializeAuthorization(callbackUrl);

	ctx.status = HttpStatus.OK;
	ctx.body = { oauthToken };
});
 */

twitterAuthRouter.get('/request_token', requestToken);

twitterAuthRouter.post('/access_token', koaBody(), async (ctx) => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { oauth_token, oauth_verifier } = ctx.request.body;
	await completeLogin(<string>oauth_verifier, <string>oauth_token);
});

export default twitterAuthRouter;
