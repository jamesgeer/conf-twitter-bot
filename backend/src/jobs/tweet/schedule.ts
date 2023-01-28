import { TwitterApi } from 'twitter-api-v2';
import { getScheduledTweets } from './api/schedule-tweets-model';
import { TWITTER_API_KEY, TWITTER_API_SECRET } from '../../keys';
import { TwitterOAuth } from '../../routes/oauths/oauths';
import { updateTweetSent } from '../../routes/tweets/tweets-model';

const userClient = (oauth: TwitterOAuth): TwitterApi =>
	new TwitterApi({
		appKey: <string>TWITTER_API_KEY,
		appSecret: <string>TWITTER_API_SECRET,
		accessToken: oauth.accessToken,
		accessSecret: oauth.accessSecret,
	});

/**
 * Every [set_interval] retrieve tweets from the database that have not been sent and have
 * a scheduled time before now, and [now + one minute], loop over results and post these to Twitter
 */
const tweetSchedule = async (): Promise<void> => {
	const scheduledTweets = await getScheduledTweets();
	console.log(`TWEET_CRON: ${scheduledTweets.length} tweets loaded.`);

	scheduledTweets.forEach((scheduledTweet) => {
		const { oauth, tweets } = scheduledTweet;

		// if object contains no oauth or any tweets then skip
		if (!oauth || !tweets) {
			return;
		}

		const client = userClient(oauth);

		tweets.forEach(async (tweet) => {
			try {
				const result = await client.v1.tweet(tweet.content);
				if (result) {
					await updateTweetSent(tweet.id, true);
				}
				console.log(`Posted tweet ${tweet.id}`);
			} catch (e) {
				console.log(e);
				console.log(`Failed to post tweet ${tweet.id}`);
			}
		});
	});
};

export default tweetSchedule;
