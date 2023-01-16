import DateTimePicker from './DateTimePicker';
import React, { useContext, useRef, useState } from 'react';
import TweetContent from './TweetContent';
import TweetMediaButtons from './TweetMediaButtons';
import { HTTPTweet, Tweet } from '../../types';
import { Button } from '@chakra-ui/react';
import { AccountContext } from '../../../accounts/context/AccountContext';
import { AccountContextProps } from '../../../accounts/types';
import { useCreateTweet } from '../../api/createTweet';
import { useEditTweet } from '../../api/editTweet';
import dayjs from 'dayjs';
import axios from 'axios';
import HttpStatus from 'http-status';
import { useCreateTweetWithUpload } from '../../../uploads/api/createUpload';
import EditLocalUploadsList from '../../../uploads/components/EditLocalUploadsList';
import EditUploadsList from '../../../uploads/components/EditUploadsList';

interface Props {
	isEdit: boolean;
	setIsEdit: React.Dispatch<React.SetStateAction<boolean>> | null;
	tweet: Tweet;
}

export interface DateTimeHandle {
	getDateTime: () => string;
}

const TweetForm = ({ isEdit, setIsEdit, tweet }: Props) => {
	const { account } = useContext(AccountContext) as AccountContextProps;

	const contentRef = useRef<HTMLTextAreaElement | null>(null);
	const scheduleRef = useRef<DateTimeHandle>();

	const [media, setMedia] = useState<File[]>();
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const createTweetMutation = useCreateTweet();
	const createTweetWithUploadMutation = useCreateTweetWithUpload();
	const editTweetMutation = useEditTweet();

	let initContent = '';
	let initDateTime = '';
	if (isEdit) {
		initContent = tweet.content;
		initDateTime = tweet.dateTime.toString();
	}

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

		// @ts-ignore
		if (!validTextInput(contentRef.current?.value) || !validScheduledDateTime(scheduleRef.current?.getDateTime())) {
			return;
		}

		await submitTweet().then();
	};

	const tweetPayload = (): HTTPTweet => {
		// to appease typescript's "possibly null" error
		const dateTime = scheduleRef.current ? scheduleRef.current?.getDateTime() : '';
		const content = contentRef.current ? contentRef.current?.value : '';

		return {
			...(isEdit && { tweetId: tweet.id }), // add tweet id if tweet is in edit mode
			accountId: account.id,
			twitterUserId: account.twitterUser.id,
			dateTime,
			content,
		};
	};

	const mediaPayload = (): FormData => {
		const formData = new FormData();

		formData.append('tweetId', tweet.id.toString());
		media?.map((medium: File) => formData.append('media', medium));

		return formData;
	};

	const submitTweet = async (): Promise<void> => {
		try {
			// tweet was edited
			if (isEdit) {
				await editTweetMutation.mutateAsync(tweetPayload()).then(() => setIsEdit && setIsEdit(false));
			} else {
				// new tweet with just content, no media to upload
				if (!media) {
					await createTweetMutation.mutateAsync(tweetPayload()).then(() => {
						// @ts-ignore
						contentRef.current.value = ''; // clear content
					});
					return;
				}

				// new tweet with media attached
				const payload = { tweetPayload: tweetPayload(), mediaPayload: mediaPayload() };
				await createTweetWithUploadMutation.mutateAsync(payload).then(() => {
					// @ts-ignore
					contentRef.current.value = ''; // clear content
					setMedia(undefined); // clear uploads
				});
			}
		} catch (e) {
			if (axios.isAxiosError(e)) {
				switch (e.response?.status) {
					case HttpStatus.UNAUTHORIZED:
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
				<Button colorScheme="gray" onClick={() => setIsEdit && setIsEdit(false)}>
					Cancel
				</Button>
			</div>
		);
	};

	return (
		<form className="mt-2 text-black" onSubmit={(e) => handleSubmission(e)}>
			{isEdit && cancelEdit()}
			<div className="flex gap-x-4 relative">
				<div>
					<img
						className="w-[48px] h-auto rounded-full"
						src={account.twitterUser.profileImageUrl}
						alt="profile"
					/>
				</div>
				<div className="text-xl mt-2 w-full">
					<TweetContent contentRef={contentRef} initContent={initContent} />
					{isEdit && tweet.uploads ? (
						<EditUploadsList media={tweet.uploads} />
					) : (
						<EditLocalUploadsList media={media} setMedia={setMedia} />
					)}
					<div className="flex items-center justify-between border-t-1 border-slate-100">
						<DateTimePicker ref={scheduleRef} initDateTime={initDateTime} />
						<div className="absolute right-0">
							<button className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
								{isEdit ? 'Update' : 'Tweet'}
							</button>
						</div>
					</div>
					<TweetMediaButtons media={media} setMedia={setMedia} />
				</div>
				<p className={`text-red-500 ${isError ? 'block' : 'hidden'}`}>{errorMessage}</p>
			</div>
		</form>
	);
};

export default TweetForm;
