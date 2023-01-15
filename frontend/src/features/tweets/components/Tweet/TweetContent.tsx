import React, { useState } from 'react';

interface Props {
	contentRef: React.RefObject<HTMLTextAreaElement>;
}

const TweetContent = ({ contentRef }: Props) => {
	return (
		<textarea
			className="w-full resize-none outline-none placeholder:text-sgray placeholder:text-opacity-75 overflow-hidden dark:bg-transparent dark:text-white"
			placeholder="What's on your mind?"
			ref={contentRef}
		></textarea>
	);
};

export default TweetContent;
