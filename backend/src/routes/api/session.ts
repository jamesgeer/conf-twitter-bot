import Router from '@koa/router';
import koaBody from 'koa-body';
import { isLoggedIn, login, logout } from '../../controllers/session-controller';

const sessionRouter = new Router({ prefix: '/session' });

// GET: /api/session
sessionRouter.get('/', isLoggedIn);

// POST: /api/session/login
sessionRouter.post('/login', koaBody(), login);

// POST: /api/session/logout
sessionRouter.post('/logout', koaBody(), logout);

export default sessionRouter;
