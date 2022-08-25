import Router from '@koa/router';
import { account, accounts } from './accounts-controller';

const twitterAccountRouter = new Router({ prefix: '/twitter' });

twitterAccountRouter.get('/account/:userId', account);

twitterAccountRouter.get('/accounts', accounts);

export default twitterAccountRouter;
