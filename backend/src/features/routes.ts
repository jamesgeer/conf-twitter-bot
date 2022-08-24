import Router from '@koa/router';
import userRouter from './user/user.route';
import sessionRouter from './session/session.route';
import twitterAuthRouter from './twitter-oauth/twitter-oauth.route';
import twitterAccountRouter from './account/account.route';
import tweetsRouter from './tweet/tweet.route';
import papersRouter from './paper/paper.route';

// routes located in ./api will be prefixed with /api
const router = new Router({ prefix: '/api' });

// append additional routes to below variable to enable
const routes = [userRouter, sessionRouter, twitterAuthRouter, twitterAccountRouter, tweetsRouter, papersRouter];

// loop over routes to enable them
for (const route of routes) {
	router.use(route.routes(), route.allowedMethods());
}

export default router;
