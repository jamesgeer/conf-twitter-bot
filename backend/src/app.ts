import Koa from 'koa';
import Logger from 'koa-logger';
import cors from '@koa/cors';
import koaSession from 'koa-session';
import router from './routes';

const PORT = process.env.PORT || 33333;

const SESSION_CONFIG = {
	key: 'ConfTwBot',
	/**
	 * (number || 'session') maxAge in ms (default is 1 days)
	 * 'session' will result in a cookie that expires when session/browser is closed
	 * Warning: If a session cookie is stolen, this cookie will never expire
	 * rolling: (boolean) Force a session identifier cookie to be set on every response.
	 * The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false)
	 */
	maxAge: 86400000,
	autoCommit: true /** (boolean) automatically commit headers (default true) */,
	overwrite: true /** (boolean) can overwrite or not (default true) */,
	httpOnly: true /** (boolean) httpOnly or not (default true) */,
	signed: true /** (boolean) signed or not (default true) */,
	rolling: false,
	renew: true,
	secure: false,
	sameSite: true,
};

// eslint-disable-next-line import/prefer-default-export
export const app = new Koa();

app.keys = ['Session Key Secret 5346fdg434'];
app.proxy = true;
app.use(koaSession(SESSION_CONFIG, app));

app.use(async (ctx, next) => {
	try {
		await next();
		console.log(`${ctx.method} ${ctx.url} RESPONSE: ${ctx.response.status}`);
	} catch (error) {
		console.error(error);
	}
});

app.use(cors({ origin: '*' }));
app.use(Logger());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
	console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/', PORT, PORT);
});
