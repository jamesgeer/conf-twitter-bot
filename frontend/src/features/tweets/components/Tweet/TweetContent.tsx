import React, { useState } from 'react';

interface Props {
	contentRef: React.RefObject<HTMLTextAreaElement>;
	initContent: string;
}

const TweetContent = ({ contentRef, initContent }: Props) => {
	return (
		<textarea
			className="w-full resize-none outline-none placeholder:text-sgray placeholder:text-opacity-75 overflow-hidden dark:bg-transparent dark:text-white"
			placeholder="What's on your mind?"
			ref={contentRef}
			defaultValue={initContent}
		></textarea>
	);
};

export default TweetContent;
