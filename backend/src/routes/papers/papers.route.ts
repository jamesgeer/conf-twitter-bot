import Router from '@koa/router';
import koaBody from 'koa-body';
import {
	paper,
	papers,
	searchedPapers,
	patchPaper,
	removePaper,
	summariseAbstract,
	authorsPapers,
} from './papers-controller';

const papersRouter = new Router({ prefix: '/papers' });

/**
 * Get papers based on filter options
 * ?search: optional search string
 * ?source: optional source e.g. acm
 *
 * GET /api/papers/filter
 */
papersRouter.get('/filter', searchedPapers);

/**
 * Get paper with ID
 *
 * GET: /api/papers/:id
 */
papersRouter.get('/:id', paper);

/**
 * Get all papers
 *
 * GET /api/papers
 */
papersRouter.get('/', papers);

/**
 * Update paper with ID
 *
 * PATCH: /api/papers/:id
 */
papersRouter.patch('/:id', koaBody(), patchPaper);

/**
 * Delete paper with ID
 *
 * DELETE: /api/papers/:id
 */
papersRouter.delete('/:id', removePaper);

/**
 * Summarise a abstract from paper with ID
 *
 * POST /api/papers/:id/summarise
 */

papersRouter.post('/:id/summarise', summariseAbstract);

/**
 * Gets all papers from author
 *
 * // GET /api/papers/author/:author
 */
papersRouter.get('/author/:author', authorsPapers);

export default papersRouter;
