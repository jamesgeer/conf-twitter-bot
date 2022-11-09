import TweetMenu from './TweetMenu';
import { Tweet } from '../types';
import dayjs from 'dayjs';
import { useDeleteTweet } from '../api/deleteTweet';
import { useState } from 'react';
import CreateEditTweet from './CreateEditTweet';

interface Props {
	tweet: Tweet;
}

const SingleTweet = ({ tweet }: Props) => {
	const [isEdit, setIsEdit] = useState(false);

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

	const handleEdit = () => {
		console.log(isEdit);
		setIsEdit(!isEdit);
	};

	const tweetDate = dayjs(tweet.scheduledTimeUTC).toDate().toLocaleString();

	const myTweet = () => {
		return (
			<div className="border-b border-slate-200 pb-4 flex justify-between">
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

	return isEdit ? (
		<CreateEditTweet
			isEdit={true}
			setIsEdit={setIsEdit}
			editContent={tweet.content}
			editDateTime={tweet.scheduledTimeUTC.toString()}
			tweet={tweet}
		/>
	) : (
		myTweet()
	);
};

export default SingleTweet;
