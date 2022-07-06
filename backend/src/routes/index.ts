import koaBody from 'koa-body';
import Router from '@koa/router';
import HttpStatus from 'http-status';

const router = new Router();

const indexRoute = (): void => {
	router.get('/', async (ctx) => {
		console.log('get /');
		if (!ctx.session || ctx.session.isNew || !ctx.session.isLoggedIn) {
			ctx.body = { loggedIn: true };
		} else {
			ctx.body = { loggedIn: false };
		}
		// ctx.type = 'json';
	});

	router.post('/', koaBody(), async (ctx) => {
		console.log('post /');
		if (ctx.request.body && ctx.request.body.password) {
			if (ctx.request.body.password === 'appPassword') {
				if (ctx.session) {
					ctx.session.isLoggedIn = true;
					ctx.session.save();
					ctx.session.manuallyCommit();

					ctx.body = { message: 'Login successful' };
					ctx.status = HttpStatus.OK;
					return;
				}
			}
		}

		ctx.body = { error: 'Invalid login' };
	});
};

export default indexRoute;
