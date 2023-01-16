import { Box, Button, Image, SimpleGrid } from '@chakra-ui/react';
import uuid from 'react-uuid';
import { IconX } from '@tabler/icons';
import React from 'react';
import { Upload, Uploads } from '../types';

interface Props {
	media: Uploads;
}

const EditUploadsList = ({ media }: Props) => {
	const handleDelete = (upload: Upload) => {
		console.log('click');
	};

	const attachments = () =>
		media?.map((upload: Upload) => {
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
						onClick={() => handleDelete(upload)}
					>
						<IconX />
					</Button>
					<Image objectFit="cover" borderRadius="1rem" minHeight="100%" src={upload.url} />
				</Box>
			);
		});

	return (
		<SimpleGrid columns={4} spacing={10} paddingTop="1rem" paddingBottom="1rem">
			{attachments()}
		</SimpleGrid>
	);
};

export default EditUploadsList;
