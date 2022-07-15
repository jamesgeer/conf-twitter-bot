/**
 * Route for retrieving stored Twitter accounts for login selection
 * ---
 * GET: /api/twitter/account
 * Get single Twitter account
 * ---
 * GET: /api/twitter/accounts
 * Get all Twitter accounts
 * ---
 */
import Router from '@koa/router';
import { account, accounts } from '../../controllers/twitter-accounts-controller';

const twitterAccountRouter = new Router({ prefix: '/twitter' });

twitterAccountRouter.get('/account', account);

twitterAccountRouter.get('/accounts', accounts);

export default twitterAccountRouter;
