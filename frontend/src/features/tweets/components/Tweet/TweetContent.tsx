import React, { useState } from 'react';

interface Props {
	content: string;
	setContent: React.Dispatch<React.SetStateAction<string>>;
}

const TweetContent = ({ content }: any) => {
	return (
		<textarea
			className="w-full resize-none outline-none placeholder:text-sgray placeholder:text-opacity-75 overflow-hidden dark:bg-transparent dark:text-white"
			placeholder="What's on your mind?"
			ref={content}
		></textarea>
	);
};

export default TweetContent;
