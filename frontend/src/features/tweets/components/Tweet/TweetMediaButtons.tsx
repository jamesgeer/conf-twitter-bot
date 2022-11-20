import { Input } from '@chakra-ui/react';
import React from 'react';

interface Props {
	setImages: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const TweetMediaButtons = ({ setImages }: Props) => {
	return <Input type="file" name="tweet_image" onChange={(e) => setImages(e.target!.files![0])} />;
};

export default TweetMediaButtons;
