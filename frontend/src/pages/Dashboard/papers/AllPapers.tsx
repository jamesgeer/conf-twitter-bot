import axios from 'axios';
import { Tweet, papers } from '../../../types';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const AllPapers = () => {
	const [papers, setPapers] = useState<Papers>([]);

	useEffect(() => {
		if (papers.length === 0) {
			getpapers().then();
		}
	}, [papers]);

	const getpapers = async () => {
		try {
			const response = await axios.get('/api/papers');
			setpapers(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const displaypapers = papers.map((tweet: Tweet, index) => {
		const tweetDate = dayjs(tweet.scheduledTimeUTC).toDate().toLocaleString();
		return (
			<div key={index} className="border-b border-slate-200 pb-4">
				<small>{tweetDate}</small>
				<p>{tweet.text}</p>
			</div>
		);
	});

	return <div className="grid gap-4">{displaypapers}</div>;
};

export default AllPapers;
