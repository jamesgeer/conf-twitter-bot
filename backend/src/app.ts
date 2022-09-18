import Koa from 'koa';
import Logger from 'koa-logger';
import cors from '@koa/cors';
import koaSession from 'koa-session';
import * as dotenv from 'dotenv';
import router from './routes';
// import cronJobs from './jobs';

dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 4000;

const SESSION_CONFIG = {
	key: 'ConfTwBot',
	maxAge: 86400000,
	autoCommit: true,
	overwrite: true,
	httpOnly: true,
	signed: true,
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

// fix for: TypeError: Do not know how to serialize a BigInt
(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

app.use(async (ctx, next) => {
	try {
		await next();
		console.log(`${ctx.method} ${ctx.url} RESPONSE: ${ctx.response.status}`);
	} catch (error) {
		console.error(error);
	}
});

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(Logger());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
	console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/', PORT, PORT);
});

// run cron jobs
// cronJobs();
