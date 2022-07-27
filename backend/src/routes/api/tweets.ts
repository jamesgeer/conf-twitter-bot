import Router from '@koa/router';
import koaBody from 'koa-body';
import { tweets, scheduledTweets, sentTweets, createTweet } from '../../controllers/tweets-controller';

const tweetsRouter = new Router({ prefix: '/tweets' });

// GET: /api/tweets
tweetsRouter.get('/', tweets);

// GET: /api/tweets/scheduled
tweetsRouter.get('/scheduled', scheduledTweets);

// GET: /api/tweets/sent
tweetsRouter.get('/sent', sentTweets);

// POST: /api/tweets
tweetsRouter.post('/', koaBody(), createTweet);

export default tweetsRouter;
