import Router from '@koa/router';
import koaBody from 'koa-body';
import { tweet, tweets, scheduledTweets, sentTweets, createTweet, updateTweet, removeTweet } from './tweets-controller';

const tweetsRouter = new Router({ prefix: '/tweets' });

// GET: /api/tweets/:id
tweetsRouter.get('/:id', tweet);

// GET: /api/tweets
tweetsRouter.get('/', tweets);

// GET: /api/tweets/scheduled
tweetsRouter.get('/scheduled', scheduledTweets);

// GET: /api/tweets/sent
tweetsRouter.get('/sent', sentTweets);

// POST: /api/tweets
tweetsRouter.post('/', koaBody(), createTweet);

// PATCH: /api/tweets/:id
tweetsRouter.patch('/:id', koaBody(), updateTweet);

// DELETE: /api/tweets/:id
tweetsRouter.delete('/:id', removeTweet);

export default tweetsRouter;
