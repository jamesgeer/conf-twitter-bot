import Router from '@koa/router';
import koaBody from 'koa-body';
import { user, createUser } from './user-controller';

const userRouter = new Router({ prefix: '/user' });

// GET: /api/user/:id
userRouter.get('/:userId', user);

// POST: /api/user
userRouter.post('/', koaBody(), createUser);

export default userRouter;
