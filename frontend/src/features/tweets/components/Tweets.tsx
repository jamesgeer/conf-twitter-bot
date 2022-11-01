import { Tweet } from '../types';
import { useTweets } from '../api/getTweets';
import dayjs from 'dayjs';

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

	const displayTweets = tweets.map((tweet: Tweet, index) => {
		const tweetDate = dayjs(tweet.scheduledTimeUTC).toDate().toLocaleString();
		return (
			<div key={index} className="border-b border-slate-200 pb-4">
				<small>{tweetDate}</small>
				<p>{tweet.content}</p>
			</div>
		);
	});

	return (
		<>
			{tweets.length > 0 ? (
				<div
					className={
						isList.activeLayout === 'list' ? 'grid gap-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
					}
				>
					{displayTweets}
				</div>
			) : (
				<p>No tweets to display.</p>
			)}
		</>
	);
};

export default Tweets;
