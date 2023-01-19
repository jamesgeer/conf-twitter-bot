import Router from '@koa/router';
import koaBody from 'koa-body';
import {
	tweet,
	tweets,
	createTweet,
	updateTweet,
	removeTweet,
	twitterUserTweets,
	createTwitterUserTweet,
} from './tweets-controller';

const tweetsRouter = new Router();

/**
 * Get all Twitter User's tweets
 *
 * GET: /api/twitter-users/:id/tweets
 */
tweetsRouter.get('/twitter-users/:id/tweets', twitterUserTweets);

/**
 * Create Tweet for Twitter User
 *
 * POST: /api/twitter-users/:id/tweets
 */
tweetsRouter.post('/twitter-users/:id/tweets', koaBody(), createTwitterUserTweet);

/**
 * Get tweet with ID
 *
 * GET: /api/tweets/:id
 */
tweetsRouter.get('/tweets/:id', tweet);

/**
 * Get all Tweets
 *
 * GET /api/tweets
 */
tweetsRouter.get('/tweets', tweets);

/**
 * Create Tweet
 *
 * POST /api/tweets
 */
tweetsRouter.post('/tweets', koaBody(), createTweet);

/**
 * Update Tweet with ID
 *
 * PATCH: /api/tweets/:id
 */
tweetsRouter.patch('/tweets/:id', koaBody(), updateTweet);

/**
 * Delete Tweet with ID
 *
 * DELETE: /api/tweets/:id
 */
tweetsRouter.delete('/tweets/:id', removeTweet);

export default tweetsRouter;
