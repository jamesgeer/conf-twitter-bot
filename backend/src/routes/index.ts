import koaBody from 'koa-body';
import Router from '@koa/router';
import HttpStatus from 'http-status';

const router = new Router();

router.get('/', async (ctx) => {
	console.log('get /');
	if (!ctx.session || ctx.session.isNew || !ctx.session.isLoggedIn) {
		ctx.body = { loggedIn: false };
	} else {
		ctx.body = { loggedIn: true };
	}
});

router.post('/', koaBody(), async (ctx) => {
	console.log('post /');
	console.log('Request:');
	console.log(ctx.request);
	console.log();
	console.log('Body:');
	console.log(ctx.request.body);
	console.log();
	console.log('Request Cookie:');
	const requestCookies = ctx.request.header.cookie;
	const cookie = requestCookies.split('; ConfTwBot=').pop().split(';')[0];
	console.log(cookie);
	console.log();
	console.log('Session Cookie:');
	console.log(ctx.cookies.get('ConfTwBot'));

	/**
	const { password } = ctx.request.body;

	if (ctx.request.body && password) {
		if (password === 'appPassword') {
			console.log('valid password');
			if (ctx.session) {
				ctx.session.isLoggedIn = true;
				ctx.session.save();
				ctx.session.manuallyCommit();

				ctx.body = { message: 'Login successful' };
				ctx.status = HttpStatus.OK;
				console.log(ctx);
				return;
			}
		}
	}
	*/
	ctx.body = { error: 'Invalid login' };
});

export default router;
