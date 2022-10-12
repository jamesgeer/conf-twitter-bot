import React, { useContext, useState } from 'react';
import { AccountContext } from '../../accounts/context/AccountContext';
import { AccountContextProps } from '../../accounts/types';
import dayjs from 'dayjs';
import HttpStatus from 'http-status';
import ScheduleTweet from './ScheduleTweet';
import { useCreateTweet } from '../api/createTweet';
import axios from 'axios';

const CreateTweet = () => {
	const { account } = useContext(AccountContext) as AccountContextProps;
	const [tweetText, setTweetText] = useState('');
	const [dateTimeISO, setDateTimeISO] = useState('');
	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState('');

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

		if (!validTextInput(tweetText) || !validScheduledDateTime(dateTimeISO)) {
			return;
		}

		// validation passed, post tweet to backend
		postTweet().then();
	};

	const postTweet = async (): Promise<void> => {
		const payload = {
			accountId: account.id,
			twitterUserId: account.twitterUser.id,
			scheduledTimeUTC: dateTimeISO,
			content: tweetText,
		};

		try {
			await createTweetMutation.mutateAsync(payload).then(() => setTweetText(''));
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

	const formError = (errorMessage: string): void => {
		setError(true);
		setErrorText(errorMessage);
	};

	return (
		<form className="px-7 mt-2 text-black" onSubmit={(e) => handleTweetSubmission(e)}>
			<div className="flex gap-x-4 relative">
				<div>
					<img
						className="w-[48px] h-auto rounded-full"
						src={account.twitterUser.profileImageUrl}
						alt="profile"
					/>
				</div>
				<div className="text-xl mt-2 w-full">
					<textarea
						className="w-full resize-none outline-none placeholder:text-sgray placeholder:text-opacity-75 overflow-hidden"
						placeholder="What's on your mind?"
						value={tweetText}
						onChange={(e) => setTweetText(e.target.value)}
					></textarea>
					<div className="flex items-center justify-between border-t-1 border-slate-100">
						<ScheduleTweet setDateTimeISO={setDateTimeISO} />
						<div className="absolute right-0">
							<button className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
								Tweet
							</button>
						</div>
					</div>
					<p className={`text-red-500 ${error ? 'block' : 'hidden'}`}>{errorText}</p>
				</div>
			</div>
		</form>
	);
};

export default CreateTweet;
