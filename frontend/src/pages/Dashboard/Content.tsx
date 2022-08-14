import TweetBox from '../../components/ui/TweetBox';
import AllTweets from './tweets/AllTweets';

const Content = () => {
	return (
		<div className="col-span-8">
			<h2 className="text-xl font-bold mb-8">Dashboard</h2>
			<TweetBox />
			<hr className="my-8" />
			<h2 className="text-xl font-bold mb-4">Tweets</h2>
			<AllTweets />
		</div>
	);
};

export default Content;
