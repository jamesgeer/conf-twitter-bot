import { readFileSync, existsSync } from 'fs';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import koaSession from 'koa-session';
import { processTemplate } from './templates.js';
import { getConfiguration, setConfiguration, robustPath } from './util.js';
import { Tweet, Config, ConfigForUser } from './data-types.js';
import { deleteTweetById, getQueuedTweets, loadAll, loadDataAndScheduleTasks, loadFullDetails, saveTweet } from './data.js';
import { completeLogin, getKnownTwitterAccounts, getTwitterDetails, initializeAuthorization, initTwitterKeys } from './twitter.js';

const port = process.env.PORT || 33333;
const appPassword = process.env.APP_PASSWORD || '';

// const DEBUG = 'DEBUG' in process.env ? process.env.DEBUG === 'true' : false;
const DEV = 'DEV' in process.env ? process.env.DEV === 'true' : false;
const serverUrl = 'APP_BASE_URL' in process.env ? process.env.APP_BASE_URL : `http://127.0.0.1:${port}`;


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
app.proxy = true;

async function getIndex(ctx) {
  if (ctx.query.twitterUserId) {
    if (ctx.query.twitterUserId === 'switch') {
      ctx.session.userId = undefined;
    } else {
      ctx.session.userId = ctx.query.twitterUserId;
    }
    ctx.session.save();
    ctx.session.manuallyCommit();
  }

  if (!ctx.session.userId) {
    const data = {accounts: await getKnownTwitterAccounts()};
    ctx.body = processTemplate('twitter-accounts.html', data);
  } else {
    ctx.body = processTemplate('index.html', await getTwitterDetails(ctx.session.userId));
  }
}

router.get('/', async (ctx) => {
  if (!ctx.session || ctx.session.isNew || !ctx.session.isLoggedIn) {
    ctx.body = processTemplate('login.html');
  } else {
    await getIndex(ctx);
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

        await getIndex(ctx);
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
  if (!ctx.session || !ctx.session.isLoggedIn|| !ctx.session.userId) {
    ctx.status = 403;
    ctx.body = {error: 'Not authorized to access this resource'};
    ctx.type = 'json';
    return false;
  }
  return true;
}

function isAuthorizedTextResponse(ctx) {
  if (!ctx.session || !ctx.session.isLoggedIn) {
    ctx.status = 403;
    ctx.body = 'Not authorized to access this resource';
    ctx.type = 'text';
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
  tweet.userId = ctx.session?.userId;
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

  const tweets = getQueuedTweets(ctx.session?.userId);
  ctx.type = 'json';
  ctx.body = {tweets};
});

router.get('/configuration', async (ctx) => {
  if (!isAuthorizedJsonResponse(ctx)) { return; }

  ctx.body = getConfiguration(ctx.session?.userId);
  ctx.type = 'json';
});

router.post('/configuration', koaBody(), async (ctx) => {
  if (!isAuthorizedJsonResponse(ctx)) { return; }

  const data = await ctx.request.body;
  setConfiguration(ctx.session?.userId, <ConfigForUser> data);

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
  if (!isAuthorizedTextResponse(ctx)) { return; }

  const twitterAuthUrl = await initializeAuthorization(
    `${serverUrl}/twitter-authorization-callback`, '/');

  console.log(`[IDX] Redirect to ${twitterAuthUrl}`);
  ctx.status = 302;
  ctx.redirect(twitterAuthUrl);
});

router.get('/twitter-authorization-callback', async (ctx) => {
  const { oauth_token, oauth_verifier } = ctx.query;
  completeLogin(<string>oauth_verifier, <string>oauth_token);
  ctx.status = 302;
  ctx.redirect('/');
});

// router.get('/send-tweet/:id', async (ctx) => {
//   if (!isAuthorizedJsonResponse(ctx)) { return; }

//   const tweet = getQueuedTweet(Number(ctx.params.id));
//   if (tweet) {
//     createTweetWithImage(tweet);
//     ctx.status = 200;
//     ctx.type = 'json';
//     ctx.body = {ok: 'done'};
//   } else {
//     ctx.status = 404;
//     ctx.type = 'json';
//     ctx.body = {error: 'tweet not found'};
//   }
// });

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
initTwitterKeys(
  process.env.TWITTER_API_KEY || '',
  process.env.TWITTER_API_SECRET || '');

(async () => {
  console.log(`Starting server on ${serverUrl}`);
  app.listen(port);
})();
