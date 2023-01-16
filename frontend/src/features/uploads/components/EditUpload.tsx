import { Box, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Upload } from '../types';
import RevertDeleteButton from './ui/RevertDeleteButton';
import DeleteUploadButton from './ui/DeleteUploadButton';

interface Props {
	upload: Upload;
}

const EditUpload = ({ upload }: Props) => {
	const [isDelete, setIsDelete] = useState(false);

	const handleClick = () => {
		console.log('click');
		setIsDelete(!isDelete);
	};

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
		</Box>
	);
};

export default EditUpload;
