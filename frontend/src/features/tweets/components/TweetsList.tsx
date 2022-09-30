import { useEffect, useState } from 'react';
import { Tweet, Tweets } from '../types';
import { getTweets } from '../api/getTweets';
import dayjs from 'dayjs';

const TweetsList = () => {
	const [tweets, setTweets] = useState<Tweets>([]);

	useEffect(() => {
		getTweets().then((tweets) => setTweets(tweets));
	}, []);

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

export default TweetsList;
