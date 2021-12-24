import Koa from 'koa';
import koaBody from 'koa-body';
// import koaBody from 'koa-body';
import Router from 'koa-router';
import { processTemplate } from './templates.js';
import { getConfiguration } from './util.js';
import { loadAll, loadFullDetails } from './data.js';

const port = process.env.PORT || 33333;

// const DEBUG = 'DEBUG' in process.env ? process.env.DEBUG === 'true' : false;
// const DEV = 'DEV' in process.env ? process.env.DEV === 'true' : false;

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = processTemplate('index.html');
  ctx.type = 'html';
});

router.post('/load-urls', koaBody(), async (ctx) => {
  const data = await ctx.request.body;
  const urls = data.urls.trim().split('\n');

  for (const i in urls) {
    urls[i] = urls[i].trim();
  }

  const papers = await loadAll(urls);

  ctx.type = 'json';
  ctx.body = { papers };
});

router.get('/configuration', async (ctx) => {
  ctx.body = getConfiguration();
  ctx.type = 'json';
});

router.get('/paper/:id',async (ctx) => {
  const paper = await loadFullDetails(Number(ctx.params.id));

  ctx.type = 'json';
  ctx.body = paper;
});

app.use(router.routes());
app.use(router.allowedMethods());

(async () => {
  console.log(`Starting server on http://localhost:${port}`);
  app.listen(port);
})();
