import React from 'react';
import { Image } from '@chakra-ui/react';

interface Props {
	media: File[] | undefined;
	setMedia: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

const TweetMedia = ({ media, setMedia }: Props) => {
	const removeFile = (index: number) => {
		setMedia(media?.slice(index, 1));
	};

	return (
		<div>
			{media?.map((medium: File) => {
				const url = URL.createObjectURL(medium);
				return <Image src={url} onClick={() => removeFile(1)} />;
			})}
		</div>
	);
};

export default TweetMedia;
