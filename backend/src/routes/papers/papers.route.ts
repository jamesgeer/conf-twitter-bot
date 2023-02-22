import Router from '@koa/router';
import { authorsPapers, papers, searchedPapers } from './papers-controller';

const papersRouter = new Router({ prefix: '/papers' });

// GET /api/papers
papersRouter.get('/', papers);

// GET /api/papers/filter/:search?/:source?
papersRouter.get('/filter/:search?/:source?', searchedPapers);

// GET /api/papers/:author
papersRouter.get('/:author', authorsPapers);

// GET /api/papers/:paperId
// papersRouter.get('/:paperId', paper);

export default papersRouter;
