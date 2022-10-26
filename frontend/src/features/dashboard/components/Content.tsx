import CreateTweet from '../../tweets/components/CreateTweet';
import TweetsList from '../../tweets/components/TweetsList';
import PapersList from '../../papers/components/PapersList';
import ToggleListGrid from './toggleListGrid';

interface Props {
	active: { index: number; title: string };
}

const Content = ({ active }: Props) => {
	return (
		<div className="col-span-8">
			<h2 className="text-xl font-bold mb-8">Dashboard</h2>
			<CreateTweet />
			<hr className="my-8" />
			<div className="flex items-center gap-6">
				<h2 className="text-xl font-bold mb-4">{active.title}</h2>
				{active.title !== '' && (
					<div className="pb-3">
						<ToggleListGrid />
					</div>
				)}
			</div>
			{active.title === 'Tweets' && <TweetsList />}
			{active.title === 'Papers' && <PapersList />}
		</div>
	);
};

export default Content;
