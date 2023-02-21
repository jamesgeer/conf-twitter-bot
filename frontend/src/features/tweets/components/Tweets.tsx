import { Tweet, Tweets as TweetArray } from '../types';
import { useTweets } from '../api/getTweets';
import SingleTweet from './SingleTweet';
import TweetToggles from './TweetToggles';
import { useEffect, useState } from 'react';

interface Props {
	isList: { activeLayout: string };
}

const Tweets = ({ isList }: Props) => {
	const [toggles, setToggles] = useState({
		all: true,
		sent: false,
		unsent: false,
	});

	const { isLoading, error, data: tweets } = useTweets();

	const [toggledTweets, setToggledTweets] = useState<TweetArray>(tweets);

	useEffect(() => {
		if (toggles.all) {
			setToggledTweets(tweets);
		} else if (toggles.sent) {
			let filteredSent = tweets.filter((tweet) => tweet.sent === true);
			setToggledTweets(filteredSent);
		} else {
			let filteredUnsent = tweets.filter((tweet) => tweet.sent === false);
			setToggledTweets(filteredUnsent);
		}
	}, [toggles, tweets]);

	if (isLoading) {
		return <div>Loading Tweets...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	const displayTweets = () => {
		return (
			<>
				<div
					className={
						isList.activeLayout === 'list' ? 'grid gap-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
					}
				>
					{toggledTweets.map((tweet: Tweet) => (
						<SingleTweet key={tweet.id} tweet={tweet} />
					))}
				</div>
			</>
		);
	};

	return toggledTweets.length === 0 ? (
		<>
			<TweetToggles toggles={toggles} setToggles={setToggles} />
			<p>No tweets to display.</p>
		</>
	) : (
		<>
			<TweetToggles toggles={toggles} setToggles={setToggles} />
			{displayTweets()}
		</>
	);
};

export default Tweets;
