import axios from 'axios';
import { Tweet, Tweets } from '../../../types';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const AllTweets = () => {
	const [tweets, setTweets] = useState<Tweets>([]);

	useEffect(() => {
		getTweets().then();
	}, []);

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
				<p>{tweet.content}</p>
			</div>
		);
	});

	return <>{tweets.length > 0 ? <div className="grid gap-4">{displayTweets}</div> : <p>No tweets to display.</p>}</>;
};

export default AllTweets;
