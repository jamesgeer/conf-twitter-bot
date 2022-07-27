import Router from '@koa/router';
import sessionRouter from './api/session';
import twitterAuthRouter from './api/twitter';
import twitterAccountRouter from './api/account';
import tweetsRouter from './api/tweets';

// routes located in ./api will be prefixed with /api
const router = new Router({ prefix: '/api' });

// append additional routes to below variable to enable
const routes = [sessionRouter, twitterAuthRouter, twitterAccountRouter, tweetsRouter];

// loop over routes to enable them
for (const route of routes) {
	router.use(route.routes(), route.allowedMethods());
}

export default router;
