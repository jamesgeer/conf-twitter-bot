import koaBody from 'koa-body';
import Router from 'koa-router';

interface Tweet {
	id?: number;
	text: string;

	/** This is a data url encoding of the image/PNG. */
	image: string;

	paperId: number;
	userId?: string;

	/** UTC time as per Date.toJSON(). */
	scheduledTime?: string;

	/** Whether the tweet was already sent. */
	sent?: boolean;
}

async function queueTweet() {
	const dataUrl = 'Base64 encoded image string (should be optional)';
	const tweetText = 'Text to appear within tweet';
	const id = 0; // paper id

	const tweet = {
		text: tweetText,
		image: dataUrl,
		paperId: id,
	};

	const persistedTweet = await postTweet(tweet);

	if (persistedTweet) {
		// scheduler: complicated
		// updateSchedule();
	}
}

async function postTweet(tweet: Tweet): Promise<Tweet | null> {
	const response = await fetch('/queue-tweet', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(tweet),
	});
	const result = await response.json();
	if (result.ok) {
		return result.tweet;
	}
	return null;
}

const router = new Router();
router.post('/queue-tweet', koaBody(), async (ctx) => {
	const tweet = await ctx.request.body;
	tweet.userId = ctx.session?.userId;
	saveTweet(tweet);
	ctx.type = 'json';
	ctx.body = {
		ok: true,
		tweet,
	};
});
