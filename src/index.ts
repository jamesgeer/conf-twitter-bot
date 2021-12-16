import Koa from 'koa';
import koaBody from 'koa-body';
// import koaBody from 'koa-body';
import Router from 'koa-router';
import { getListOfPapers, loadAll } from './acm-dl-scrapper.js';
import { processTemplate } from './templates.js';

const port = process.env.PORT || 33333;

// const DEBUG = 'DEBUG' in process.env ? process.env.DEBUG === 'true' : false;
// const DEV = 'DEV' in process.env ? process.env.DEV === 'true' : false;

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = processTemplate('index.html', {
    data: JSON.stringify(
      await getListOfPapers(
        'https://dl.acm.org/doi/proceedings/10.1145/3357390'
      )
    )
  });
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

app.use(router.routes());
app.use(router.allowedMethods());

(async () => {
  console.log(`Starting server on http://localhost:${port}`);
  app.listen(port);
})();
