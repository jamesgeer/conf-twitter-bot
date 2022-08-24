import Router from '@koa/router';
import koaBody from 'koa-body';
import { isLoggedIn, login, logout } from './session-controller';
import { getActiveTwitterUser, setActiveTwitterUser } from './session-twitter-controller';

const sessionRouter = new Router({ prefix: '/session' });

// GET: /api/session
sessionRouter.get('/', isLoggedIn);

// POST: /api/session/login
sessionRouter.post('/login', koaBody(), login);

// POST: /api/session/logout
sessionRouter.post('/logout', koaBody(), logout);

// GET: /api/session/twitter/user/
sessionRouter.get('/twitter/user/', getActiveTwitterUser);

// POST: /api/session/twitter/user/:userId
sessionRouter.post('/twitter/user/:userId', koaBody(), setActiveTwitterUser);

export default sessionRouter;
