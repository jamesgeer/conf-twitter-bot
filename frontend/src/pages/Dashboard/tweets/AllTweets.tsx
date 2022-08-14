import axios from 'axios';
import { Tweet, Tweets } from '../../../types/twitter-types';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const AllTweets = () => {
	const [tweets, setTweets] = useState<Tweets>([]);

	useEffect(() => {
		if (tweets.length === 0) {
			getTweets().then();
		}
	}, [tweets]);

	const getTweets = async () => {
		try {
			const response = await axios.get('/api/tweets');
			setTweets(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const displayTweets = tweets.map((tweet: Tweet, index) => {
		const tweetDate = dayjs(tweet.scheduledTimeUTC).toDate().toLocaleString();
		return (
			<div key={index} className="border-b border-slate-200 pb-4">
				<small>{tweetDate}</small>
				<p>{tweet.text}</p>
			</div>
		);
	});

	return <div className="grid gap-4">{displayTweets}</div>;
};

export default AllTweets;
