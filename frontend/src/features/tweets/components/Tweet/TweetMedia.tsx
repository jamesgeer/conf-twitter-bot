import React from 'react';
import { SimpleGrid, Box, Image, Button } from '@chakra-ui/react';
import { IconX } from '@tabler/icons';
import uuid from 'react-uuid';

interface Props {
	media: File[] | undefined;
	setMedia: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

const TweetMedia = ({ media, setMedia }: Props) => {
	const removeFile = (medium: File) => {
		// set new file array without the selected attached media, if media array empty then set to undefined
		media ? setMedia((existing) => existing?.filter((file) => file !== medium)) : setMedia(undefined);
	};

	const attachments = () =>
		media?.map((medium: File) => {
			const url = URL.createObjectURL(medium);
			return (
				<Box key={uuid()} position="relative">
					<Button
						variant="solid"
						position="absolute"
						left="2"
						top="2"
						size="xs"
						padding="5px"
						height="initial"
						borderRadius="full"
						_hover={{ bg: 'red', color: 'white' }}
						onClick={() => removeFile(medium)}
					>
						<IconX />
					</Button>
					<Image objectFit="cover" borderRadius="1rem" minHeight="100%" src={url} />
				</Box>
			);
		});

	return (
		<SimpleGrid columns={4} spacing={10} paddingTop="1rem" paddingBottom="1rem">
			{attachments()}
		</SimpleGrid>
	);
};

export default TweetMedia;
