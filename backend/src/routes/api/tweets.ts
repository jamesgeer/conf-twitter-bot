import Router from '@koa/router';

const tweetsRouter = new Router({ prefix: '/tweets' });

// GET: /api/tweets
tweetsRouter.get('/', () => {
	console.log('get all tweets');
});

// GET: /api/tweets/scheduled
tweetsRouter.get('/scheduled', () => {
	console.log('get all scheduled tweets');
});

// GET: /api/tweets/sent
tweetsRouter.get('/sent', () => {
	console.log('get all sent tweets');
});

// POST: /api/tweets
tweetsRouter.post('/', () => {
	console.log('post new tweet');
});

export default tweetsRouter;
