import Koa from 'koa';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';

// eslint-disable-next-line import/prefer-default-export
export const app = new Koa();

app.use(async (ctx, next) => {
	try {
		await next();
		console.log(`${ctx.method} ${ctx.url} RESPONSE: ${ctx.response.status}`);
	} catch (error) {
		console.error(error);
	}
});

app.use(cors({ origin: '*' }));
app.use(bodyParser({ enableTypes: ['json'] }));
