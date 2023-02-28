import Router from '@koa/router';
import koaBody from 'koa-body';
import { paper, papers, searchedPapers, patchPaper, removePaper, summary } from './papers-controller';

const papersRouter = new Router({ prefix: '/papers' });

/**
 * Get paper with ID
 *
 * GET: /api/papers/:id
 */
papersRouter.get('/papers/:id', paper);

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
papersRouter.patch('/papers/:id', koaBody(), patchPaper);

/**
 * Delete paper with ID
 *
 * DELETE: /api/papers/:id
 */
papersRouter.delete('/papers/:id', removePaper);

export default papersRouter;

/**
 * Summarise a abstract from paper with ID
 *
 * POST /api/papers/:id/summarise
 */

papersRouter.post('/:id/summarise', summary);
