import TweetMenu from './TweetMenu';
import { Tweet } from '../types';
import dayjs from 'dayjs';
import { useDeleteTweet } from '../api/deleteTweet';
import { useState } from 'react';
import TweetForm from './Tweet';
import { Upload } from '../../uploads/types';

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
		setIsEdit(!isEdit);
	};

	const tweetDate = dayjs(tweet.dateTime).toDate().toLocaleString();

	const myTweet = () => {
		return (
			<div className="border-b border-slate-200 pb-4 flex justify-between">
				<div>
					<small>{tweetDate}</small>
					<p>{tweet.content}</p>
					<div>
						{tweet.uploads &&
							tweet.uploads.map((upload: Upload) => {
								return <img src={upload.url} alt={upload.alt} />;
							})}
					</div>
				</div>
				<TweetMenu handleClick={handleClick} />
			</div>
		);
	};

	return isEdit ? <TweetForm isEdit={isEdit} setIsEdit={setIsEdit} tweet={tweet} /> : myTweet();
};

export default SingleTweet;
