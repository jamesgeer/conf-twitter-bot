import { Box, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Upload } from '../types';
import RevertDeleteButton from './ui/RevertDeleteButton';
import DeleteUploadButton from './ui/DeleteUploadButton';
import ConfirmDeleteUploadButton from './ui/ConfirmDeleteUploadButton';

interface Props {
	upload: Upload | File;
	handleDelete: ((upload: Upload, confirmDelete: boolean) => void) | ((file: File, confirmDelete: boolean) => void);
}

const EditUpload = ({ upload, handleDelete }: Props) => {
	const [isDelete, setIsDelete] = useState(false);

	let url = '';
	if (upload instanceof File) {
		url = URL.createObjectURL(upload);
	} else {
		url = upload.url;
	}

	let test: any;
	if (upload instanceof File) {
		test = upload;
	} else {
		test = upload;
	}

	return (
		<Box position="relative">
			{isDelete ? (
				<RevertDeleteButton handleClick={() => setIsDelete(false)} />
			) : (
				<DeleteUploadButton handleClick={() => setIsDelete(true)} />
			)}
			<Image
				objectFit="cover"
				borderRadius="1rem"
				minHeight="100%"
				src={url}
				filter={isDelete ? 'grayscale(100%)' : ''}
			/>
			{isDelete && <ConfirmDeleteUploadButton handleClick={() => handleDelete(test, true)} />}
		</Box>
	);
};

export default EditUpload;
