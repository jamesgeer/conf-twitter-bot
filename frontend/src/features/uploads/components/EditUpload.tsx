import { Box, Button, Image } from '@chakra-ui/react';
import uuid from 'react-uuid';
import React, { useState } from 'react';
import { Upload } from '../types';
import RevertDeleteButton from './ui/RevertDeleteButton';
import DeleteUploadButton from './ui/DeleteUploadButton';

interface Props {
	upload: Upload;
}

const EditUpload = ({ upload }: Props) => {
	const [isDelete, setIsDelete] = useState(false);

	return (
		<Box key={uuid()} position="relative">
			{isDelete ? <RevertDeleteButton handleClick={} /> : <DeleteUploadButton handleClick={} />}
			<Image objectFit="cover" borderRadius="1rem" minHeight="100%" src={upload.url} />
		</Box>
	);
};

export default EditUpload;
