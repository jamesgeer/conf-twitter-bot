import TweetMenu from './TweetMenu';
import { Tweet } from '../types';
import dayjs from 'dayjs';
import { useDeleteTweet } from '../api/deleteTweet';
import { useState } from 'react';
import TweetForm from './Tweet';
import UploadsList from '../../uploads/components/UploadsList';
import { Badge } from '@chakra-ui/react';

interface Props {
	tweet: Tweet;
}

const SingleTweet = ({ tweet }: Props) => {
	const [isEdit, setIsEdit] = useState(false);

	const { id, content, dateTime, uploads, sent } = tweet;

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
					<div className="flex items-center justify-center">
						<small>{tweetDate}</small>
						{sent && (
							<Badge fontSize={12} ml="4" colorScheme="blue">
								Posted
							</Badge>
						)}
					</div>
					<p>{content}</p>
					{uploads && <UploadsList uploads={uploads} />}
				</div>
				<TweetMenu sent={sent} handleClick={handleClick} />
			</div>
		);
	};

	return isEdit ? <TweetForm isEdit={isEdit} setIsEdit={setIsEdit} initTweet={tweet} /> : myTweet();
};

export default SingleTweet;
