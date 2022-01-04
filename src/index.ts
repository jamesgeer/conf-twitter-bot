import { readFileSync, existsSync } from 'fs';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { processTemplate } from './templates.js';
import { getConfiguration, setConfiguration, robustPath } from './util.js';
import { Tweet, Config } from './data-types.js';
import { deleteTweetById, getQueuedTweet, getQueuedTweets, loadAll, loadDataAndScheduleTasks, loadFullDetails, saveTweet } from './data.js';
import { createTweetWithImage, initializeAuthorization, login } from './twitter.js';

const port = process.env.PORT || 33333;
const appKey = process.env.TWITTER_API_KEY || '';
const appSecret = process.env.TWITTER_API_SECRET || '';

// const DEBUG = 'DEBUG' in process.env ? process.env.DEBUG === 'true' : false;
const DEV = 'DEV' in process.env ? process.env.DEV === 'true' : false;

const serverUrl = `http://127.0.0.1:${port}`;
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
  ctx.body = {
    ok: true,
    tweet};
});

router.get('/delete-tweet/:id', async (ctx) => {
  deleteTweetById(Number(ctx.params.id));
  ctx.type = 'json';
  ctx.body = {ok: true};
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

router.get('/paper/:id', async (ctx) => {
  const paper = await loadFullDetails(Number(ctx.params.id));

  ctx.type = 'json';
  ctx.body = paper;
});

router.get('/twitter-login', async (ctx) => {
  const twitterAuthUrl = await initializeAuthorization(
    appKey, appSecret, `${serverUrl}/twitter-authorization-callback`, '/');

  console.log(`[IDX] Redirect to ${twitterAuthUrl}`);
  ctx.status = 302;
  ctx.redirect(twitterAuthUrl);
});

router.get('/twitter-authorization-callback', async (ctx) => {
  const { oauth_token, oauth_verifier } = ctx.query;
  login(<string>oauth_verifier, <string>oauth_token);
  ctx.status = 302;
  ctx.redirect('/');
});

router.get('/send-tweet/:id', async (ctx) => {
  const tweet = getQueuedTweet(Number(ctx.params.id));
  if (tweet) {
    createTweetWithImage(tweet);
  }
});

router.get(/^\/\w+(-\w+)*\.js(\.map)?$/, async (ctx) => {
  const fileName = robustPath('../dist' + ctx.url);
  if (existsSync(fileName)) {
    ctx.status = 200;
    ctx.type = 'js';
    ctx.body = readFileSync(fileName);
  } else {
    ctx.status = 404;
    ctx.type = 'text';
    ctx.body = 'Requested Resource not Found';
  }
});

if (DEV) {
  router.get(/^\/src\/\w+(-\w+)*\.ts/, async (ctx) => {
    const fileName = robustPath(ctx.url.replace('/src/', ''));
    if (existsSync(fileName)) {
      ctx.status = 200;
      ctx.type = 'js';
      ctx.body = readFileSync(fileName);
    } else {
      ctx.status = 404;
      ctx.type = 'text';
      ctx.body = 'Requested Resource not Found';
    }
  });
}

app.use(router.routes());
app.use(router.allowedMethods());

(async () => {
  console.log(`Starting server on ${serverUrl}`);
  app.listen(port);
})();
