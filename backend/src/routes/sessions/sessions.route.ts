import Router from '@koa/router';
import koaBody from 'koa-body';
import { accountLogin, userSession, userLogin, userLogout, accountSession } from './sessions-controller';

const sessionsRouter = new Router({ prefix: '/sessions' });

// GET: /api/sessions
sessionsRouter.get('/', userSession);

// POST: /api/sessions
sessionsRouter.post('/', koaBody(), userLogin);

// POST: /api/sessions/logout
sessionsRouter.post('/logout', koaBody(), userLogout);

// GET: /api/sessions/account
sessionsRouter.get('/account', accountSession);

// POST: /api/sessions/account
sessionsRouter.post('/account', koaBody(), accountLogin);

export default sessionsRouter;
