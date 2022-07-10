/**
 * ---
 * GET: /api/session
 * Get session (True if exists)
 * ---
 * POST: /api/session/new
 * Create session (App login)
 * ---
 * POST: /api/session/delete
 * Delete session (App logout)
 * ---
 */
import Router from '@koa/router';
import HttpStatus from 'http-status';
import koaBody from 'koa-body';

const sessionRouter = new Router({ prefix: '/session' });

// GET: /api/session
sessionRouter.get('/', async (ctx) => {
	console.log('get /');
	if (!ctx.session || ctx.session.isNew || !ctx.session.isLoggedIn) {
		ctx.body = { loggedIn: false };
	} else {
		ctx.body = { loggedIn: true };
	}
	ctx.status = HttpStatus.OK;
});

// POST: /api/session
sessionRouter.post('/', koaBody(), async (ctx) => {
	// make sure request contains a body
	if (!ctx.request.body) {
		ctx.body = { message: 'Missing request body' };
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	// check if response contains a login cookie
	const cookies = ctx.request.header.cookie;
	if (cookies) {
		// extract the ConfTwBot cookie (request may contain many cookies)
		const confTwBotCookie = cookies.split('; ConfTwBot=').pop().split(';')[0];
		// if the confTwBot cookie is missing, then the variable will contain an empty string
		if (confTwBotCookie.length > 0) {
			// verify browser cookie matches existing session cookie
			if (confTwBotCookie === ctx.cookies.get('ConfTwBot')) {
				ctx.body = { message: 'Existing login session' };
				ctx.status = HttpStatus.OK;
				return;
			}
		}
	}

	// response did not contain a valid cookie, perform password verification
	const { password } = ctx.request.body;
	if (password && password === 'appPassword') {
		// koa-session needs to be running to create/store session cookie
		if (!ctx.session) {
			ctx.body = { error: 'Session could not be established' };
			ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
			return;
		}

		// save login session
		ctx.session.isLoggedIn = true;
		ctx.session.save();
		ctx.session.manuallyCommit();

		// return success (contains http cookie for ConfTwBot)
		ctx.body = { message: 'Login successful' };
		ctx.status = HttpStatus.OK;
		console.log(ctx);
		return;
	}

	// invalid login credentials
	ctx.body = { error: 'Invalid login' };
	ctx.status = HttpStatus.UNAUTHORIZED;
});

export default sessionRouter;
