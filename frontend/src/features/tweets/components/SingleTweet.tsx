import TweetMenu from './TweetMenu';
import { Tweet } from '../types';
import dayjs from 'dayjs';
import { useDeleteTweet } from '../api/deleteTweet';

interface Props {
	tweet: Tweet;
}

const SingleTweet = ({ tweet }: Props) => {
	const mutation = useDeleteTweet();

	const handleClick = (menuItem: string) => {
		switch (menuItem) {
			case 'delete':
				return handleDelete();
			case 'edit':
				return handleEdit();
		}
	};

	const handleDelete = async () => {
		await mutation.mutateAsync(tweet.id);
	};

	const handleEdit = () => console.log('TODO');

	const tweetDate = dayjs(tweet.scheduledTimeUTC).toDate().toLocaleString();

	return (
		<div key={tweet.id} className="border-b border-slate-200 pb-4 flex justify-between">
			<div>
				<small>{tweetDate}</small>
				<p>{tweet.content}</p>
			</div>
			<div>
				<TweetMenu handleClick={handleClick} />
			</div>
		</div>
	);
};

export default SingleTweet;
