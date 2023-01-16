import { Box, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Upload } from '../types';
import RevertDeleteButton from './ui/RevertDeleteButton';
import DeleteUploadButton from './ui/DeleteUploadButton';
import ConfirmDeleteUploadButton from './ui/ConfirmDeleteUploadButton';
import axios from 'axios';

interface Props {
	upload: Upload;
	handleDelete: (upload: Upload, undoDelete: boolean) => void;
}

const EditUpload = ({ upload, handleDelete }: Props) => {
	const [isDelete, setIsDelete] = useState(false);

	const handleClick = () => {
		setIsDelete(!isDelete);
		handleDelete(upload, isDelete);
	};

	// const handleDeleteNow = async () => {
	// 	await axios.delete('/api/uploads/' + upload.id);
	// };

	return (
		<Box position="relative">
			{isDelete ? (
				<RevertDeleteButton handleClick={handleClick} />
			) : (
				<DeleteUploadButton handleClick={handleClick} />
			)}
			<Image
				objectFit="cover"
				borderRadius="1rem"
				minHeight="100%"
				src={upload.url}
				filter={isDelete ? 'grayscale(100%)' : ''}
			/>
			{isDelete && <ConfirmDeleteUploadButton handleClick={() => handleDelete(upload, false)} />}
		</Box>
	);
};

export default EditUpload;
