import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { Upload, Uploads } from '../types';
import EditUpload from './EditUpload';
import uuid from 'react-uuid';
import { Tweet } from '../../tweets/types';
import { deleteUpload } from '../api/deleteUpload';

interface Props {
	uploads: Uploads;
	setUploads: React.Dispatch<React.SetStateAction<Tweet>>;
}

const EditUploadsList = ({ uploads, setUploads }: Props) => {
	// case where user wants to delete upload without clicking the "update" button
	const handleDelete = async (upload: Upload) => {
		await deleteUpload(upload.id).then(() => {
			const filteredUploads = uploads.filter((tweetUpload) => tweetUpload !== upload);
			setUploads((tweet) => ({ ...tweet, uploads: filteredUploads }));
		});
	};

	return (
		<SimpleGrid columns={4} spacing={10} paddingTop="1rem" paddingBottom="1rem">
			{uploads?.map((upload: Upload) => (
				<EditUpload key={uuid()} upload={upload} handleDelete={handleDelete} />
			))}
		</SimpleGrid>
	);
};

export default EditUploadsList;
