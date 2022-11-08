import ScheduleTweet from './ScheduleTweet';
import React from 'react';

interface Props {
	handleSubmission: (e: React.FormEvent<HTMLFormElement>) => void;
	profileImgSrc: string;
	content: string;
	setContent: React.Dispatch<React.SetStateAction<string>>;
	dateTime: string;
	setDateTime: React.Dispatch<React.SetStateAction<string>>;
	isError: boolean;
	errorMessage: string;
}

const TweetForm = ({
	handleSubmission,
	profileImgSrc,
	content,
	setContent,
	dateTime,
	setDateTime,
	isError,
	errorMessage,
}: Props) => {
	return (
		<form className="px-7 mt-2 text-black" onSubmit={(e) => handleSubmission(e)}>
			<div className="flex gap-x-4 relative">
				<div>
					<img className="w-[48px] h-auto rounded-full" src={profileImgSrc} alt="profile" />
				</div>
				<div className="text-xl mt-2 w-full">
					<textarea
						className="w-full resize-none outline-none placeholder:text-sgray placeholder:text-opacity-75 overflow-hidden dark:bg-transparent dark:text-white"
						placeholder="What's on your mind?"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					></textarea>
					<div className="flex items-center justify-between border-t-1 border-slate-100">
						<ScheduleTweet dateTime={dateTime} setDateTime={setDateTime} />
						<div className="absolute right-0">
							<button className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
								Tweet
							</button>
						</div>
					</div>
					<p className={`text-red-500 ${isError ? 'block' : 'hidden'}`}>{errorMessage}</p>
				</div>
			</div>
		</form>
	);
};

export default TweetForm;
