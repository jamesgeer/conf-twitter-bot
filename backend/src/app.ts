import Koa from 'koa';
import Router from '@koa/router';
import BodyParser from 'koa-bodyparser';
import Logger from 'koa-logger';
import cors from 'koa-cors';
import koaBody from 'koa-body';
import HttpStatus from 'http-status';
import indexRoute from './routes';

// eslint-disable-next-line import/prefer-default-export
const app = new Koa();

app.use(async (ctx, next) => {
	try {
		await next();
		console.log(`${ctx.method} ${ctx.url} RESPONSE: ${ctx.response.status}`);
	} catch (error) {
		console.error(error);
	}
});

app.use(cors({ origin: '*' }));
app.use(BodyParser({ enableTypes: ['json'] }));
app.use(Logger());
app.use(cors());

const router = new Router();
router.get('/', async (ctx) => {
	console.log('get /');
	if (!ctx.session || ctx.session.isNew || !ctx.session.isLoggedIn) {
		ctx.body = { loggedIn: false };
	} else {
		ctx.body = { loggedIn: true };
	}
	// ctx.type = 'json';
});

router.post('/', koaBody(), async (ctx) => {
	console.log('post /');
	console.log(ctx.request.body);
	console.log(ctx.request.body.password);
	if (ctx.request.body && ctx.request.body.password) {
		if (ctx.request.body.password === 'appPassword') {
			console.log('valid password');
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
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 33333;

app.listen(PORT, () => {
	console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/', PORT, PORT);
});
