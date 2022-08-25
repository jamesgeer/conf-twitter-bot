import Router from '@koa/router';
import koaBody from 'koa-body';
import { accountLogin, userSession, userLogin, userLogout, accountSession } from './sessions-controller';

const sessionRouter = new Router({ prefix: '/session' });

// GET: /api/sessions
sessionRouter.get('/', userSession);

// POST: /api/sessions
sessionRouter.post('/', koaBody(), userLogin);

// POST: /api/sessions/logout
sessionRouter.post('/logout', koaBody(), userLogout);

// GET: /api/sessions/account
sessionRouter.get('/account', accountSession);

// POST: /api/sessions/account
sessionRouter.post('/account', koaBody(), accountLogin);

export default sessionRouter;
