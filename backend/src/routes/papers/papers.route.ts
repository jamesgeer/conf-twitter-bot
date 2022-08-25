import Router from '@koa/router';
import { paper, papers } from './papers-controller';

const papersRouter = new Router({ prefix: '/papers' });

// GET /api/papers
papersRouter.get('/', papers);

// GET /api/papers/:paperId
papersRouter.get('/:paperId', paper);

export default papersRouter;
