import { Box, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Upload } from '../types';
import RevertDeleteButton from './ui/RevertDeleteButton';
import DeleteUploadButton from './ui/DeleteUploadButton';
import ConfirmDeleteUploadButton from './ui/ConfirmDeleteUploadButton';

interface Props {
	upload: Upload | File;
	handleDelete:
		| ((upload: Upload, selectDelete: boolean, confirmDelete: boolean) => void)
		| ((file: File, selectDelete: boolean, confirmDelete: boolean) => void);
}

const EditUpload = ({ upload, handleDelete }: Props) => {
	const [isDelete, setIsDelete] = useState(false);

	let url = '';
	if (upload instanceof File) {
		url = URL.createObjectURL(upload);
	} else {
		url = upload.url;
	}

	let mediaToDelete: any;
	if (upload instanceof File) {
		mediaToDelete = upload;
	} else {
		mediaToDelete = upload;
	}

	const handleClick = () => {
		setIsDelete(!isDelete);
		handleDelete(mediaToDelete, isDelete, false);
	};

	return (
		<Box position="relative">
			{isDelete ? (
				<RevertDeleteButton handleClick={() => handleClick()} />
			) : (
				<DeleteUploadButton handleClick={() => handleClick()} />
			)}
			<Image
				objectFit="cover"
				borderRadius="1rem"
				minHeight="100%"
				src={url}
				filter={isDelete ? 'grayscale(100%)' : ''}
			/>
			{isDelete && <ConfirmDeleteUploadButton handleClick={() => handleDelete(mediaToDelete, true, true)} />}
		</Box>
	);
};

export default EditUpload;
