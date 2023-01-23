import { Tweets } from '../../../routes/tweets/tweets';
import { TwitterOAuth } from '../../../routes/oauths/oauths';

interface ScheduledTweet {
	id: bigint; // twitter user id
	tweets: Tweets;
	oauth: TwitterOAuth | null;
}

export type ScheduledTweets = Array<ScheduledTweet>;
