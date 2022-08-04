import React, { useContext, useState } from 'react';
import { ActiveAccountContext } from '../../context/ActiveAccountContext';
import { ActiveTwitterAccountContext } from '../../types/twitter-types';
import DateTimeSelection from '../forms/DateTimeSelection';

const TweetBox = () => {
	const { activeAccount } = useContext(ActiveAccountContext) as ActiveTwitterAccountContext;
	const [tweetText, setTweetText] = useState('');
	const [dateTimeISO, setDateTimeISO] = useState('');
	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState('');

	const validTextInput = (text: string): boolean => {
		if (text.length === 0) {
			setError(true);
			setErrorText('Please enter a tweet.');
			return false;
		}
		return true;
	};

	const validScheduledDateTime = (dateTimeIso: string): boolean => {
		return true;
	};

	const handleTweetSubmission = () => {
		if (!validTextInput(tweetText) || !validScheduledDateTime(dateTimeISO)) {
			return;
		}
	};

	return (
		<div className="px-7 mt-2 text-black">
			<div className="flex gap-x-4 relative">
				<div>
					<img className="w-[48px] h-auto rounded-full" src={activeAccount.profileImageUrl} alt="profile" />
				</div>
				<div className="text-xl mt-2 w-full">
					<textarea
						className="w-full resize-none outline-none placeholder:text-sgray placeholder:text-opacity-75 overflow-hidden"
						placeholder="What's on your mind?"
						value={tweetText}
						onChange={(e) => setTweetText(e.target.value)}
					></textarea>
					<div className="flex items-center justify-between border-t-1 border-slate-100">
						<DateTimeSelection setDateTimeISO={setDateTimeISO} />
						<div className="absolute right-0">
							<button
								className="pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
								disabled={tweetText.length === 0}
								onClick={() => console.log('Create Tweet')}
							>
								Tweet
							</button>
						</div>
					</div>
					<p className={`text-red-500 text-xs italic ${error ? 'block' : 'hidden'}`}>{errorText}</p>
				</div>
			</div>
		</div>
	);
};

export default TweetBox;
