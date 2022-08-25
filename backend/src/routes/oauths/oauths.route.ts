import Router from '@koa/router';
import koaBody from 'koa-body';
import { requestToken, accessToken } from './oauths-controller';

const twitterAuthRouter = new Router({ prefix: '/twitter/oauth' });

// GET: /api/twitter/oauth/request_token
twitterAuthRouter.get('/request_token', requestToken);

// POST: /api/twitter/oauth/access_token
twitterAuthRouter.post('/access_token', koaBody(), accessToken);

export default twitterAuthRouter;
