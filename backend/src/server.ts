import Koa from 'koa';
import Router from '@koa/router';
import BodyParser from 'koa-bodyparser';
import Logger from 'koa-logger';
import cors from 'koa-cors';
import HttpStatus from 'http-status';

const app = new Koa();

const PORT = process.env.PORT || 3001;

app.use(BodyParser());
app.use(Logger());
app.use(cors());

const router = new Router();

router.get('/book', async (ctx, next) => {
	const books = ['Speaking javascript', 'Fluent Python', 'Pro Python', 'The Go programming language'];
	ctx.status = HttpStatus.OK;
	ctx.body = books;
	await next();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
	console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/', PORT, PORT);
});
