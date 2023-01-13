import React from 'react';
import { Image } from '@chakra-ui/react';

interface Props {
	media: File[] | undefined;
	setMedia: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

const TweetMedia = ({ media, setMedia }: Props) => {
	const removeFile = (medium: File) => {
		// set new file array without the selected attached media, if media array empty then set to undefined
		media ? setMedia((existing) => existing?.filter((file) => file !== medium)) : setMedia(undefined);
	};

	return (
		<div>
			{media?.map((medium: File) => {
				const url = URL.createObjectURL(medium);
				return <Image src={url} onClick={() => removeFile(medium)} />;
			})}
		</div>
	);
};

export default TweetMedia;
