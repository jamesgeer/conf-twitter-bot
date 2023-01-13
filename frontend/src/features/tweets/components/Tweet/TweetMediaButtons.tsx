import { Input, FormLabel, useColorMode, FormControl, FormErrorMessage } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IconPhoto } from '@tabler/icons';

interface Props {
	media: File[] | undefined;
	setMedia: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

const TweetMediaButtons = ({ media, setMedia }: Props) => {
	const [formError, setFormError] = useState({ error: false, message: '' });

	const { colorMode } = useColorMode();

	const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;

		// reset form error if there was an error previously
		formError.error && setFormError({ error: false, message: '' });

		if (!files) {
			return;
		}

		if (files.length > 4 || (media && media.length + files.length > 4)) {
			setFormError({ error: true, message: 'You cannot attach more than four items.' });
			return;
		}

		// concat if state already contains files, otherwise set undefined to the array of files
		media ? setMedia((existing) => existing?.concat(Array.from(files))) : setMedia(Array.from(files));
	};

	return (
		<div className="pt-4">
			<FormControl isInvalid={formError.error} className="inline-block">
				{/* FormLabel acts as a button for file input */}
				<FormLabel htmlFor="attachMedia" cursor="pointer">
					{/* Not sure why chakra does not handle dark mode here*/}
					<IconPhoto color={colorMode === 'dark' ? 'white' : 'black'} />
				</FormLabel>
				<Input
					id="attachMedia"
					type="file"
					name="files[]"
					accept="image/*"
					hidden
					multiple
					onChange={(e) => handleUpload(e)}
				/>
				{formError.error && <FormErrorMessage>{formError.message}</FormErrorMessage>}
			</FormControl>
		</div>
	);
};

export default TweetMediaButtons;
