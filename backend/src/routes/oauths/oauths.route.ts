import Router from '@koa/router';
import koaBody from 'koa-body';
import { requestToken, accessToken } from './oauths-controller';

const oAuthsRouter = new Router({ prefix: '/oauths' });

// GET: /api/oauths/twitter/request_token
oAuthsRouter.get('/twitter/request_token', requestToken);

// POST: /api/oauths/twitter/access_token
oAuthsRouter.post('/twitter/access_token', koaBody(), accessToken);

export default oAuthsRouter;
