import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { Upload, Uploads } from '../types';
import EditUpload from './EditUpload';

interface Props {
	media: Uploads;
}

const EditUploadsList = ({ media }: Props) => {
	const handleDelete = (upload: Upload) => {
		console.log('click');
	};

	return (
		<SimpleGrid columns={4} spacing={10} paddingTop="1rem" paddingBottom="1rem">
			{media?.map((upload: Upload) => (
				<EditUpload upload={upload} />
			))}
		</SimpleGrid>
	);
};

export default EditUploadsList;
