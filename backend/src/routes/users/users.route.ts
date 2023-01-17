import Router from '@koa/router';
import koaBody from 'koa-body';
import { user, createUser } from './users-controller';

const usersRouter = new Router({ prefix: '/users' });

// GET: /api/users/:id
usersRouter.get('/:id', user);

// POST: /api/users
usersRouter.post('/', koaBody(), createUser);

export default usersRouter;
