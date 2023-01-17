import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { Upload, Uploads } from '../types';
import EditUpload from './EditUpload';
import uuid from 'react-uuid';
import { Tweet } from '../../tweets/types';
import { deleteUpload } from '../api/deleteUpload';
import EditLocalUploadsList from './EditLocalUploadsList';

interface Props {
	media: File[] | undefined;
	setMedia: React.Dispatch<React.SetStateAction<File[] | undefined>>;
	uploads: Uploads | undefined;
	setUploads: React.Dispatch<React.SetStateAction<Tweet>>;
	uploadsToDelete: Uploads;
}

const EditUploadsList = ({ media, setMedia, uploads, setUploads, uploadsToDelete }: Props) => {
	const handleDelete = async (upload: Upload, undoDelete: boolean) => {
		if (undoDelete && uploadsToDelete.includes(upload)) {
			// delete and remove from array
			uploadsToDelete = uploadsToDelete.filter((u) => u !== upload);
			return;
		}

		// empty array or does not contain upload so add
		if (uploadsToDelete === [] || !uploadsToDelete.includes(upload)) {
			uploadsToDelete.push(upload);
			return;
		}

		// already in the array so user wants to delete it now
		if (uploadsToDelete.includes(upload)) {
			// delete and remove from array
			uploadsToDelete = uploadsToDelete.filter((u) => u !== upload);
			await handleDeleteNow(upload);
			return;
		}
	};

	// case where user wants to delete upload without clicking the "update" button
	const handleDeleteNow = async (upload: Upload) => {
		await deleteUpload(upload.id).then(() => {
			const filteredUploads = uploads?.filter((tweetUpload) => tweetUpload !== upload);
			setUploads((tweet) => ({ ...tweet, uploads: filteredUploads }));
		});
	};

	return (
		<SimpleGrid columns={4} spacing={10} paddingTop="1rem" paddingBottom="1rem">
			{uploads?.map((upload: Upload) => (
				<EditUpload key={uuid()} upload={upload} handleDelete={handleDelete} />
			))}
			{media && <EditLocalUploadsList media={media} setMedia={setMedia} />}
		</SimpleGrid>
	);
};

export default EditUploadsList;
