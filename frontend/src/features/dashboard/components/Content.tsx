import CreateEditTweet from '../../tweets/components/CreateEditTweet';
import Tweets from '../../tweets/components/Tweets';
import Papers from '../../papers/components/Papers';
import ToggleListGrid from './toggleListGrid';
import { useState } from 'react';

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

	return (
		<div className="col-span-8">
			<h2 className="text-xl font-bold mb-8">Dashboard</h2>
			<CreateEditTweet isEdit={false} editContent="" editDateTime="" />
			<hr className="my-8" />
			<div className="flex items-center justify-between gap-6">
				<h2 className="text-xl font-bold mb-4">{active.title}</h2>
				{active.title !== '' && (
					<div className="pb-3">
						<ToggleListGrid isList={isList} handleClick={handleClick} />
					</div>
				)}
			</div>
			{active.title === 'Tweets' && <Tweets isList={isList} />}
			{active.title === 'Papers' && <Papers isList={isList} />}
		</div>
	);
};

export default Content;
