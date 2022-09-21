import Router from '@koa/router';
import { twitterUser } from './twitter-users-controller';

const twitterUsersRouter = new Router({ prefix: '/twitter-users' });

// GET /api/twitter-users/:id
twitterUsersRouter.get('/:id', twitterUser);

export default twitterUsersRouter;
