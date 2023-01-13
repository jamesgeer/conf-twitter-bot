import { Input, FormLabel, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { IconPhoto } from '@tabler/icons';

interface Props {
	setMedia: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

const TweetMediaButtons = ({ setMedia }: Props) => {
	const { colorMode } = useColorMode();

	const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!files) {
			return;
		}

		setMedia(Array.from(files));
	};

	return (
		<div className="pt-4">
			<div className="inline-block">
				{/* FormLabel acts as a button for file input */}
				<FormLabel htmlFor="add-image" cursor={'pointer'}>
					{/* Not sure why chakra does not handle dark mode here*/}
					<IconPhoto color={colorMode === 'dark' ? 'white' : 'black'} />
				</FormLabel>
				<Input type="file" id="add-image" name="tweet_image" onChange={(e) => handleUpload(e)} hidden></Input>
			</div>
		</div>
	);
};

export default TweetMediaButtons;
