import Tweets from '../../tweets/components/Tweets';
import Papers from '../../papers/components/Papers';
import Scraper from '../../scraper/components/Scraper';
import ToggleListGrid from './toggleListGrid';
import React, { useState } from 'react';
import TweetForm from '../../tweets/components/Tweet';

interface Props {
	active: { index: number; title: string };
}

const Content = ({ active }: Props) => {
	const [isList, setListActive] = useState({
		activeLayout: 'list',
	});

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>, name: string) => {
		e.preventDefault();
		if (isList.activeLayout !== name) {
			setListActive({
				activeLayout: name,
			});
		}
	};

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
			<TweetForm isEdit={false} setIsEdit={null} tweet={tweet} />
			<hr className="my-8" />
			<div className="flex items-center justify-between gap-6">
				<h2 className="text-xl font-bold mb-4">{active.title}</h2>
				{active.title !== '' && active.title !== 'Scraper' && (
					<div className="pb-3">
						<ToggleListGrid isList={isList} handleClick={handleClick} />
					</div>
				)}
			</div>
			{active.title === 'Tweets' && <Tweets isList={isList} />}
			{active.title === 'Papers' && <Papers isList={isList} />}
			{active.title === 'Scraper' && <Scraper />}
		</div>
	);
};

export default Content;
