import { TwitterApi } from 'twitter-api-v2';
import path from 'path';
import appRoot from 'app-root-path';
import { getScheduledTweets } from './schedule-tweets-model';
import { TWITTER_API_KEY, TWITTER_API_SECRET } from '../../keys';
import { TwitterOAuth } from '../../routes/oauths/oauths';
import { updateTweetSent } from '../../routes/tweets/tweets-model';
import { Uploads } from '../../routes/uploads/uploads';

const userClient = (oauth: TwitterOAuth): TwitterApi =>
	new TwitterApi({
		appKey: <string>TWITTER_API_KEY,
		appSecret: <string>TWITTER_API_SECRET,
		accessToken: oauth.accessToken,
		accessSecret: oauth.accessSecret,
	});

const getTwitterMediaIds = async (client: TwitterApi, uploads: Uploads): Promise<string[]> => {
	const mediaIds: string[] = [];
	let filesToUpload;

	if (uploads.length > 4) {
		filesToUpload = uploads.slice(0, 4);
	} else {
		filesToUpload = uploads;
	}

	for (const upload of filesToUpload) {
		const mediaId = await client.v1.uploadMedia(path.join(appRoot.path, 'public', 'uploads', upload.name));
		mediaIds.push(mediaId);
	}

	return mediaIds;
};

/**
 * Every [set_interval] retrieve tweets from the database that have not been sent and have
 * a scheduled time before now, and [now + one minute], loop over results and post these to Twitter
 */
const tweetSchedule = async (): Promise<void> => {
	const scheduledTweets = await getScheduledTweets();
	if (scheduledTweets.length > 0) {
		console.log(`TWEET_CRON: ${scheduledTweets.length} tweets loaded.`);
	}

	scheduledTweets.forEach((scheduledTweet) => {
		const { oauth, tweets } = scheduledTweet;

		// if object contains no oauth or any tweets then skip
		if (!oauth || !tweets) {
			return;
		}

		const client = userClient(oauth);

		tweets.forEach(async (tweet) => {
			try {
				console.log(tweet);
				if (tweet.uploads) {
					const mediaIds = await getTwitterMediaIds(client, tweet.uploads);

					console.log(mediaIds);
					if (mediaIds.length > 0) {
						const result = await client.v1.tweet(tweet.content, { media_ids: mediaIds });

						if (result) {
							await updateTweetSent(tweet.id, true);
							console.log(`Posted tweet ${tweet.id} with media`);
						}
						return;
					}
				}

				const result = await client.v1.tweet(tweet.content);
				if (result) {
					await updateTweetSent(tweet.id, true);
					console.log(`Posted tweet ${tweet.id}`);
				}
			} catch (e) {
				console.log(e);
				console.log(`Failed to post tweet ${tweet.id}`);
			}
		});
	});
};

export default tweetSchedule;
