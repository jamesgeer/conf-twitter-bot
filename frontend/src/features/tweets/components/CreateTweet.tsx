import React, { useContext, useState } from 'react';
import { AccountContext } from '../../accounts/context/AccountContext';
import { AccountContextProps } from '../../accounts/types';
import dayjs from 'dayjs';
import HttpStatus from 'http-status';
import ScheduleTweet from './ScheduleTweet';
import { useCreateTweet } from '../api/createTweet';
import axios from 'axios';
import TweetForm from './TweetForm';
import content from '../../dashboard/components/Content';

const CreateTweet = () => {
	const { account } = useContext(AccountContext) as AccountContextProps;
	const [content, setContent] = useState('');
	const [dateTime, setDateTime] = useState('');
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const createTweetMutation = useCreateTweet();

	const validTextInput = (text: string): boolean => {
		if (text.length === 0) {
			formError('Tweet did not contain any content!');
			return false;
		}
		return true;
	};

	const validScheduledDateTime = (dateTimeIso: string): boolean => {
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

	const handleTweetSubmission = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		resetFormErrors();

		if (!validTextInput(content) || !validScheduledDateTime(dateTime)) {
			return;
		}

		// validation passed, post tweet to backend
		postTweet().then();
	};

	const postTweet = async (): Promise<void> => {
		const payload = {
			accountId: account.id,
			twitterUserId: account.twitterUser.id,
			scheduledTimeUTC: dateTime,
			content: content,
		};

		try {
			await createTweetMutation.mutateAsync(payload).then(() => setContent(''));
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

	return (
		<TweetForm
			handleSubmission={handleTweetSubmission}
			profileImgSrc={account.twitterUser.profileImageUrl}
			content={content}
			setContent={setContent}
			setDateTime={setDateTime}
			isError={isError}
			errorMessage={errorMessage}
		/>
	);
};

export default CreateTweet;
