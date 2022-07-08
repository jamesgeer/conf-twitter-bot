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
	console.log(ctx.request);
	console.log(ctx.request.body);

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
				console.log('end end end');
				return;
			}
		}
	}

	ctx.body = { error: 'Invalid login' };
});

export default router;
