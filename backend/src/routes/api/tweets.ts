import Router from '@koa/router';
import koaBody from 'koa-body';
import { getTweets, getScheduledTweets, getSentTweets, postTweet } from '../../controllers/tweets-controller';

const tweetsRouter = new Router({ prefix: '/tweets' });

// GET: /api/tweets
tweetsRouter.get('/', getTweets);

// GET: /api/tweets/scheduled
tweetsRouter.get('/scheduled', getScheduledTweets);

// GET: /api/tweets/sent
tweetsRouter.get('/sent', getSentTweets);

// POST: /api/tweets
tweetsRouter.post('/', koaBody(), postTweet);

export default tweetsRouter;
