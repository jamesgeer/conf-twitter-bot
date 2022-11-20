import DateTimePicker from './DateTimePicker';
import React, { useContext, useState } from 'react';
import TweetContent from './TweetContent';
import TweetMediaButtons from './TweetMediaButtons';
import { Tweet } from '../../types';
import { Button } from '@chakra-ui/react';
import { AccountContext } from '../../../accounts/context/AccountContext';
import { AccountContextProps } from '../../../accounts/types';
import { useCreateTweet } from '../../api/createTweet';
import { useEditTweet } from '../../api/editTweet';
import dayjs from 'dayjs';
import axios from 'axios';
import HttpStatus from 'http-status';

interface Props {
	isEdit: boolean;
	setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
	tweet: Tweet;
}

const TweetForm = ({ isEdit, setIsEdit, tweet }: Props) => {
	const { account } = useContext(AccountContext) as AccountContextProps;

	const [content, setContent] = useState(tweet.content);
	const [dateTime, setDateTime] = useState(tweet.scheduledTimeUTC);
	const [images, setImages] = useState<File>();
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const createTweetMutation = useCreateTweet();
	const editTweetMutation = useEditTweet();

	const validTextInput = (text: string): boolean => {
		if (text.length === 0) {
			formError('Tweet did not contain any content!');
			return false;
		}
		return true;
	};

	const validScheduledDateTime = (dateTimeIso: Date | string): boolean => {
		const currentDateTime = dayjs();
		const submittedDateTime = dayjs(dateTimeIso);

		if (submittedDateTime.isBefore(currentDateTime)) {
			formError('You cannot Tweet to the past!');
			return false;
		}

		return true;
	};

	const resetFormErrors = () => {
		formError('');
	};

	const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		resetFormErrors();

		if (!validTextInput(content) || !validScheduledDateTime(dateTime)) {
			return;
		}

		await submitTweet().then();
	};

	const payload = () => {
		const payload = {
			accountId: account.id,
			twitterUserId: account.twitterUser.id,
			dateTime: dateTime,
			content: content,
			images: images,
		};

		const formData = new FormData();
		for (let key in payload) {
			// @ts-ignore
			formData.append(key, payload[key]);
		}

		if (isEdit) {
			formData.append('tweetId', tweet.id.toString());
		}

		return formData;
	};

	const submitTweet = async (): Promise<void> => {
		try {
			if (isEdit) {
				// @ts-ignore
				await editTweetMutation.mutateAsync(payload).then(() => setIsEdit && setIsEdit(false));
			} else {
				// @ts-ignore
				await createTweetMutation.mutateAsync(payload).then(() => setContent(''));
			}
		} catch (e) {
			if (axios.isAxiosError(e)) {
				switch (e.response?.status) {
					case HttpStatus.UNAUTHORIZED:
						console.log('log log');
						formError('You are not logged in.');
						break;

					case HttpStatus.INTERNAL_SERVER_ERROR:
						formError('Internal server error.');
						break;
				}
			}
		}
	};

	const formError = (message: string): void => {
		setIsError(true);
		setErrorMessage(message);
	};

	const cancelEdit = () => {
		return (
			<div className="flex justify-end">
				<Button colorScheme="gray" onClick={(e) => setIsEdit(false)}>
					Cancel
				</Button>
			</div>
		);
	};

	return (
		<form className="mt-2 text-black" onSubmit={(e) => handleSubmission(e)}>
			{isEdit && cancelEdit()}
			<div className="text-xl mt-2 w-full">
				<TweetContent content={content} setContent={setContent} />
				<div className="flex items-center justify-between border-t-1 border-slate-100">
					<DateTimePicker dateTime={dateTime} setDateTime={setDateTime} />
					<div className="absolute right-0">
						<button className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
							Tweet
						</button>
					</div>
					<TweetMediaButtons setImages={setImages} />
				</div>
			</div>
		</form>
	);
};

export default TweetForm;
