import Router from '@koa/router';
import { papers, searchedPapers } from './papers-controller';

const papersRouter = new Router({ prefix: '/papers' });

// GET /api/papers
papersRouter.get('/', papers);

// GET /api/papers/:search?/:source?
papersRouter.get('/filter/:search?/:source?', searchedPapers);

// GET /api/papers/:paperId
// papersRouter.get('/:paperId', paper);

export default papersRouter;
