import Router from '@koa/router';
import { account, accounts } from './accounts-controller';

const accountsRouter = new Router({ prefix: '/accounts' });

// GET /api/accounts/:accountId
accountsRouter.get('/:userId', account);

// GET /api/accounts
accountsRouter.get('/', accounts);

export default accountsRouter;
