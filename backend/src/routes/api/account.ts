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
import HttpStatus from 'http-status';

const twitterAccountRouter = new Router({ prefix: '/twitter' });

twitterAccountRouter.get('/account', async (ctx) => {
	ctx.status = HttpStatus.OK;
	ctx.body = { toDo: 'toDo' };
});

twitterAccountRouter.get('/accounts', async (ctx) => {
	ctx.status = HttpStatus.OK;
	ctx.body = { toDo: 'toDo' };
});

export default twitterAccountRouter;
