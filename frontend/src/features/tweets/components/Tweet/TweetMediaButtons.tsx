import { Input, FormLabel, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { IconPhoto } from '@tabler/icons';

interface Props {
	setImages: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const TweetMediaButtons = ({ setImages }: Props) => {
	const { colorMode } = useColorMode();
	return (
		<div className="pt-4">
			<div className="inline-block">
				{/* FormLabel acts as a button for file input */}
				<FormLabel htmlFor="add-image" cursor={'pointer'}>
					{/* Not sure why chakra does not handle dark mode here*/}
					<IconPhoto color={colorMode === 'dark' ? 'white' : 'black'} />
				</FormLabel>
				<Input
					type="file"
					id="add-image"
					name="tweet_image"
					onChange={(e) => setImages(e.target!.files![0])}
					hidden
				></Input>
			</div>
		</div>
	);
};

export default TweetMediaButtons;
