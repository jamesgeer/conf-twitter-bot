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

const accountRouter = new Router({ prefix: '/twitter' });

accountRouter.get('/account', async (ctx) => {
	ctx.status = HttpStatus.OK;
	ctx.body = { toDo: 'toDo' };
});

accountRouter.get('/accounts', async (ctx) => {
	ctx.status = HttpStatus.OK;
	ctx.body = { toDo: 'toDo' };
});

export default accountRouter;
