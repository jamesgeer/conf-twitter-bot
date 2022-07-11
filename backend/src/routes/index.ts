import Router from '@koa/router';
import sessionRouter from './api/session';
import twitterRouter from './api/twitter';

// routes located in ./api will be prefixed with /api
const router = new Router({ prefix: '/api' });

// append additional routes to below variable to enable
const routes = [sessionRouter, twitterRouter];

// loop over routes to enable them
for (const route of routes) {
	router.use(route.routes(), route.allowedMethods());
}

export default router;
