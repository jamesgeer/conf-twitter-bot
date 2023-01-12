import TweetMenu from './TweetMenu';
import { Tweet } from '../types';
import dayjs from 'dayjs';
import { useDeleteTweet } from '../api/deleteTweet';
import { useState } from 'react';
import TweetForm from './Tweet';
import DisplayUploads from '../../uploads/components/DisplayUploads';

interface Props {
	tweet: Tweet;
}

const SingleTweet = ({ tweet }: Props) => {
	const [isEdit, setIsEdit] = useState(false);

	const { id, content, dateTime, uploads } = tweet;

	const handleClick = (menuItem: string) => {
		switch (menuItem) {
			case 'delete':
				return handleDelete();
			case 'edit':
				return handleEdit();
		}
	};

	const mutation = useDeleteTweet();
	const handleDelete = async () => {
		await mutation.mutateAsync(id);
	};

	const handleEdit = () => {
		setIsEdit(!isEdit);
	};

	const tweetDate = dayjs(dateTime).toDate().toLocaleString();

	const myTweet = () => {
		return (
			<div className="border-b border-slate-200 pb-4 flex justify-between">
				<div>
					<small>{tweetDate}</small>
					<p>{content}</p>
					{uploads && <DisplayUploads uploads={uploads} />}
				</div>
				<TweetMenu handleClick={handleClick} />
			</div>
		);
	};

	return isEdit ? <TweetForm isEdit={isEdit} setIsEdit={setIsEdit} tweet={tweet} /> : myTweet();
};

export default SingleTweet;
