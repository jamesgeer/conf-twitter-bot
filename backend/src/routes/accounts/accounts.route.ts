import Router from '@koa/router';
import { account, accounts, removeAccount } from './accounts-controller';

const accountsRouter = new Router({ prefix: '/accounts' });

// GET /api/accounts/:id
accountsRouter.get('/:id', account);

// GET /api/accounts
accountsRouter.get('/', accounts);

// DELETE /api/accounts/:id
accountsRouter.delete('/:id', removeAccount);

export default accountsRouter;
