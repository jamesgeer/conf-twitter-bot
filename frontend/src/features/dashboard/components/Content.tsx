import Tweets from '../../tweets/components/Tweets';
import PaperSearch from '../../papers/components/PaperSearch';
import Scraper from '../../scraper/components/Scraper';
import ToggleListGrid from './toggleListGrid';
import React, { useState } from 'react';
import TweetForm from '../../tweets/components/Tweet';
import ActiveTitle from './ActiveTitle';
import { Outlet } from 'react-router-dom';

interface Props {
	active: { index: number; title: string };
	setActive: React.Dispatch<
		React.SetStateAction<{
			index: number;
			title: string;
		}>
	>;
}

const Content = ({ active, setActive }: Props) => {
	const tweet = {
		id: 0,
		accountId: 0,
		twitterUserId: BigInt(0),
		dateTime: '',
		content: '',
		sent: false,
	};

	return (
		<div className="col-span-8">
			<h2 className="text-xl font-bold mb-8">Dashboard</h2>
			<TweetForm isEdit={false} setIsEdit={null} initTweet={tweet} />
			<hr className="my-8" />
			<ActiveTitle title={active.title} />
			<Outlet context={setActive} />
		</div>
	);
};

export default Content;
