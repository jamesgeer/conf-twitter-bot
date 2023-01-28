import Koa from 'koa';
import cors from '@koa/cors';
import koaSession from 'koa-session';
import serve from 'koa-static';
import path from 'path';
import appRoot from 'app-root-path';
import router from './routes';
import { logToFile, initLogToFile } from './logging/logging';
import { APP_URL } from './keys';
import cronJobs from './jobs';

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

initLogToFile(); // initiate logging to file

app.use(async (ctx, next) => {
	try {
		await next();
		console.log(`${ctx.method} ${ctx.url} RESPONSE: ${ctx.response.status}`);
	} catch (error) {
		console.error(error);
		console.log(logToFile(error));
	}
});

app.use(cors({ origin: APP_URL, credentials: true }));

app.use(router.routes());
app.use(router.allowedMethods());

// serve static assets from within the public directory, for example GET /uploads/some_file.png
app.use(serve(path.join(appRoot.path, 'public')));

// run cron jobs
cronJobs().then();
