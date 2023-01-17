import React from 'react';
import { SimpleGrid, Box, Image } from '@chakra-ui/react';
import uuid from 'react-uuid';
import DeleteLocalUploadButton from './ui/DeleteLocalUploadButton';

interface Props {
	media: File[] | undefined;
	setMedia: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

/**
 * component for handling local media that has not been uploaded to the server
 * @param media
 * @param setMedia
 * @constructor
 */
const EditLocalUploadsList = ({ media, setMedia }: Props) => {
	const removeFile = (medium: File) => {
		// set new file array without the selected attached media, if media array empty then set to undefined
		media ? setMedia((existing) => existing?.filter((file) => file !== medium)) : setMedia(undefined);
	};

	const attachments = () =>
		media?.map((medium: File) => {
			const url = URL.createObjectURL(medium);
			return (
				<Box key={uuid()} position="relative">
					<DeleteLocalUploadButton handleClick={() => removeFile(medium)} />
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

export default EditLocalUploadsList;
