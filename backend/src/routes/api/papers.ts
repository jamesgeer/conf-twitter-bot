import Router from '@koa/router';

const papersRouter = new Router({ prefix: '/papers' });

const placeholder = () => {
	console.log('NOT IMPLEMENTED');
};

// GET /api/papers
papersRouter.get('/', placeholder);

// GET /api/papers/:paperId
papersRouter.get('/:paperId', placeholder);

export default papersRouter;
