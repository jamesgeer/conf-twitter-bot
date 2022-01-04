import { readFileSync, existsSync } from 'fs';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import koaSession from 'koa-session';
import { processTemplate } from './templates.js';
import { getConfiguration, setConfiguration, robustPath } from './util.js';
import { Tweet, Config } from './data-types.js';
import { deleteTweetById, getQueuedTweet, getQueuedTweets, loadAll, loadDataAndScheduleTasks, loadFullDetails, saveTweet } from './data.js';
import { createTweetWithImage, initializeAuthorization, initTwitterClient, login } from './twitter.js';

const port = process.env.PORT || 33333;
const appKey = process.env.TWITTER_API_KEY || '';
const appSecret = process.env.TWITTER_API_SECRET || '';
const appPassword = process.env.APP_PASSWORD || '';

// const DEBUG = 'DEBUG' in process.env ? process.env.DEBUG === 'true' : false;
const DEV = 'DEV' in process.env ? process.env.DEV === 'true' : false;

const serverUrl = `http://127.0.0.1:${port}`;


const SESSION_CONFIG = {
  key: 'ConfTwBot',
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: true,
  secure: !DEV,
  sameSite: true
};

const app = new Koa();
const router = new Router();

app.keys = ['Session Key Secret 5346fdg434'];

router.get('/', async (ctx) => {
  if (!ctx.session || ctx.session.isNew || !ctx.session.isLoggedIn) {
    ctx.body = processTemplate('login.html');
  } else {
    ctx.body = processTemplate('index.html');
  }
  ctx.type = 'html';
});

router.post('/', koaBody(), async (ctx) => {
  if (ctx.request.body && ctx.request.body.password) {
    if (ctx.request.body.password === appPassword) {
      if (ctx.session) {
        ctx.session.isLoggedIn = true;
        ctx.session.save();
        ctx.session.manuallyCommit();
        ctx.body = processTemplate('index.html');
        ctx.type = 'html';
        ctx.status = 200;
        return;
      }
    }
  }

  ctx.status = 302;
  ctx.redirect('/');
});

function isAuthorizedJsonResponse(ctx) {
  if (!ctx.session || !ctx.session.isLoggedIn) {
    ctx.status = 403;
    ctx.body = {error: 'Not authorized to access this resource'};
    ctx.type = 'json';
    return false;
  }
  return true;
}

router.post('/load-urls', koaBody(), async (ctx) => {
  if (!isAuthorizedJsonResponse(ctx)) { return; }

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
  if (!isAuthorizedJsonResponse(ctx)) { return; }

  const tweet = <Tweet>await ctx.request.body;
  saveTweet(tweet);
  ctx.type = 'json';
  ctx.body = {
    ok: true,
    tweet};
});

router.get('/delete-tweet/:id', async (ctx) => {
  if (!isAuthorizedJsonResponse(ctx)) { return; }

  deleteTweetById(Number(ctx.params.id));
  ctx.type = 'json';
  ctx.body = {ok: true};
});

router.get('/load-queue', async (ctx) => {
  if (!isAuthorizedJsonResponse(ctx)) { return; }

  const tweets = getQueuedTweets();
  ctx.type = 'json';
  ctx.body = {tweets};
});

router.get('/configuration', async (ctx) => {
  if (!isAuthorizedJsonResponse(ctx)) { return; }

  ctx.body = getConfiguration();
  ctx.type = 'json';
});

router.post('/configuration', koaBody(), async (ctx) => {
  if (!isAuthorizedJsonResponse(ctx)) { return; }

  const data = await ctx.request.body;
  setConfiguration(<Config> data);

  ctx.type = 'json';
  ctx.body = { ok: 'done' };
});

router.get('/paper/:id', async (ctx) => {
  if (!isAuthorizedJsonResponse(ctx)) { return; }

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
  if (!isAuthorizedJsonResponse(ctx)) { return; }

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
app.use(koaSession(SESSION_CONFIG, app));

loadDataAndScheduleTasks();
initTwitterClient(appKey, appSecret);

(async () => {
  console.log(`Starting server on ${serverUrl}`);
  app.listen(port);
})();
