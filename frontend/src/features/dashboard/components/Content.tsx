import TweetBox from '../../components/ui/TweetBox';
import TweetsList from '../../tweets/components/TweetsList';
import PapersList from '../../papers/components/PapersList';

interface Props {
	active: { index: number; title: string };
}

const Content = ({ active }: Props) => {
	return (
		<div className="col-span-8">
			<h2 className="text-xl font-bold mb-8">Dashboard</h2>
			<TweetBox />
			<hr className="my-8" />
			<h2 className="text-xl font-bold mb-4">{active.title}</h2>
			{active.title === 'Tweets' && <TweetsList />}
			{active.title === 'Papers' && <PapersList />}
		</div>
	);
};

export default Content;
