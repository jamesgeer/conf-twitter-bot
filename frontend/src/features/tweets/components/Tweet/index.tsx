import DateTimePicker from './DateTimePicker';
import React, { useState } from 'react';
import TweetContent from './TweetContent';
import TweetMediaButtons from './TweetMediaButtons';

const Tweet = () => {
	const [content, setContent] = useState('');
	const [dateTime, setDateTime] = useState('');
	const [images, setImages] = useState<File>();

	const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<form className="mt-2 text-black" onSubmit={(e) => handleSubmission(e)}>
			<TweetContent content={content} setContent={setContent} />
			<DateTimePicker dateTime={dateTime} setDateTime={setDateTime} />
			<TweetMediaButtons setImages={setImages} />
		</form>
	);
};

export default Tweet;
