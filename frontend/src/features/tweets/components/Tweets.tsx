import { Tweet } from '../types';
import { useTweets } from '../api/getTweets';
import dayjs from 'dayjs';
import TweetMenu from './TweetMenu';
import { useState } from 'react';

interface Props {
	isList: { activeLayout: string };
}

const Tweets = ({ isList }: Props) => {
	const { isLoading, error, data: tweets } = useTweets();
	const [isOpen, setIsOpen] = useState(0);

	if (isLoading) {
		return <div>Loading Tweets...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	const handleButtonClick = (e: any, tweetId: number) => {
		e.stopPropagation();
		setIsOpen(tweetId);
	};

	const displayTweets = tweets.map((tweet: Tweet, index) => {
		const tweetDate = dayjs(tweet.scheduledTimeUTC).toDate().toLocaleString();
		return (
			<div key={index} className="border-b border-slate-200 pb-4 flex justify-between">
				<div>
					<small>{tweetDate}</small>
					<p>{tweet.content}</p>
				</div>
				<div>
					<TweetMenu
						isActive={isOpen === tweet.id}
						handleButtonClick={handleButtonClick}
						tweetId={tweet.id}
					/>
				</div>
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
