import TweetBox from '../../layout/TweetBox';
import DashboardTweets from './DashboardTweets';

const DashboardContent = () => {
	return (
		<div className="col-span-8">
			<h2 className="text-xl font-bold mb-8">Dashboard</h2>
			<TweetBox />
			<hr className="my-8" />
			<h2 className="text-xl font-bold mb-4">Tweets</h2>
			<DashboardTweets />
		</div>
	);
};

export default DashboardContent;
