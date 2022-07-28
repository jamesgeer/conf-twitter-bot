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
	scheduleTweeting(tweet);
	ctx.type = 'json';
	ctx.body = {
		ok: true,
		tweet,
	};
});

function scheduleTweeting(tweet: Tweet): boolean {
	if (!tweet.scheduledTime || !tweet.id || tweet.sent || !tweet.userId) {
		return false;
	}

	cancelExistingJob(tweet.id);

	const date = new Date(tweet.scheduledTime);
	doAt(
		date,
		async () => {
			tweet.sent = true;
			persistData();
			console.log(`Send tweet: ${tweet.id}  ${new Date().toJSON()}`);
			const created = await createTweetWithImage(tweet);
			console.log(`Sending tweet ${tweet.id} ${created ? 'succeeded' : 'failed'}`);
		},
		tweet.id,
	);

	return true;
}
