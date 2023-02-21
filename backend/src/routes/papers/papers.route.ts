import Router from '@koa/router';
import koaBody from 'koa-body';
import { papers, searchedPapers, updatePaper } from './papers-controller';

const papersRouter = new Router({ prefix: '/papers' });

/**
 * Get all papers
 *
 * GET /api/papers
 */
papersRouter.get('/', papers);

/**
 * Get papers based on filter options
 * ?search: optional search string
 * ?source: optional source e.g. acm
 *
 * GET /api/papers/:search?/:source?
 */
papersRouter.get('/filter/:search?/:source?', searchedPapers);

/**
 * Update paper with ID
 *
 * PATCH: /api/papers/:id
 */
papersRouter.patch('/papers/:id', koaBody(), updatePaper);

// GET /api/papers/:paperId
// papersRouter.get('/:paperId', paper);

export default papersRouter;
