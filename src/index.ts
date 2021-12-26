import Koa from 'koa';
import koaBody from 'koa-body';
// import koaBody from 'koa-body';
import Router from 'koa-router';
import { processTemplate } from './templates.js';
import { getConfiguration, setConfiguration, Config } from './util.js';
import { getQueuedTweets, loadAll, loadFullDetails, saveTweet, Tweet } from './data.js';

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

router.post('/queue-tweet', koaBody(), async (ctx) => {
  const tweet = <Tweet>await ctx.request.body;
  saveTweet(tweet);
  ctx.type = 'json';
  ctx.body = {ok: 'done'};
});

router.get('/load-queue', async (ctx) => {
  const tweets = getQueuedTweets();
  ctx.type = 'json';
  ctx.body = {tweets};
});

router.get('/configuration', async (ctx) => {
  ctx.body = getConfiguration();
  ctx.type = 'json';
});

router.post('/configuration', koaBody(), async (ctx) => {
  const data = await ctx.request.body;
  setConfiguration(<Config> data);

  ctx.type = 'json';
  ctx.body = { ok: 'done' };
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
