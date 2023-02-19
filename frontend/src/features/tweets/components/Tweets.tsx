import { Tweet } from '../types';
import { useTweets } from '../api/getTweets';
import SingleTweet from './SingleTweet';
import ToggleListGrid from '../../dashboard/components/toggleListGrid';
import React, { useState } from 'react';

const Tweets = () => {
	const [isList, setListActive] = useState({
		activeLayout: 'list',
	});

	const { isLoading, error, data: tweets } = useTweets();

	if (isLoading) {
		return <div>Loading Tweets...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>, name: string) => {
		e.preventDefault();
		if (isList.activeLayout !== name) {
			setListActive({
				activeLayout: name,
			});
		}
	};

	const displayTweets = () => {
		return (
			<>
				<div className="pb-3 flex justify-end">
					<ToggleListGrid isList={isList} handleClick={handleClick} />
				</div>
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
