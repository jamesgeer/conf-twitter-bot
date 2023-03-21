import React, { useState } from 'react';

interface Props {
	tweetContentRef: React.RefObject<HTMLTextAreaElement>;
	initContent: string;
}

const TweetContent = ({ tweetContentRef, initContent }: Props) => {
	return (
		<textarea
			className="w-full resize-none outline-none placeholder:text-sgray placeholder:text-opacity-75 overflow-hidden dark:bg-transparent dark:text-white"
			placeholder="What's on your mind?"
			ref={tweetContentRef}
			defaultValue={initContent}
		></textarea>
	);
};

export default TweetContent;
