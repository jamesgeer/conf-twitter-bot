import { Tweet } from '../types';
import { useTweets } from '../api/getTweets';
import SingleTweet from './SingleTweet';
import TweetToggles from './TweetToggles';

interface Props {
	isList: { activeLayout: string };
}

const Tweets = ({ isList }: Props) => {
	const { isLoading, error, data: tweets } = useTweets();

	if (isLoading) {
		return <div>Loading Tweets...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	const displayTweets = () => {
		return (
			<>
				{/* temporary*/}
				<TweetToggles />
				<div
					className={
						isList.activeLayout === 'list' ? 'grid gap-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
					}
				>
					{tweets.map((tweet: Tweet) => (
						<SingleTweet key={tweet.id} tweet={tweet} />
					))}
				</div>
			</>
		);
	};

	return tweets.length === 0 ? <p>No tweets to display.</p> : displayTweets();
};

export default Tweets;
