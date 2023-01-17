import { Button } from '@chakra-ui/react';
import { IconX } from '@tabler/icons';
import React from 'react';

interface Props {
	handleClick: () => void;
}

const DeleteUploadButton = ({ handleClick }: Props) => {
	return (
		<Button
			variant="solid"
			position="absolute"
			left="2"
			top="2"
			size="xs"
			padding="5px"
			height="initial"
			borderRadius="full"
			zIndex="1"
			_hover={{ bg: 'red', color: 'white' }}
			onClick={() => handleClick()}
			title="Delete upload"
		>
			<IconX />
		</Button>
	);
};

export default DeleteUploadButton;
