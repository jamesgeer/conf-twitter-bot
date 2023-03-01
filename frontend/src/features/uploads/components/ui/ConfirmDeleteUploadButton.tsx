import { Button } from '@chakra-ui/react';
import { IconTrash } from '@tabler/icons-react';
import React from 'react';

interface Props {
	handleClick: () => void;
}

const ConfirmDeleteUploadButton = ({ handleClick }: Props) => {
	return (
		<Button
			variant="solid"
			position="absolute"
			top="2"
			right="2"
			size="xs"
			padding="5px"
			height="initial"
			borderRadius="full"
			zIndex="1"
			_hover={{ bg: 'red', color: 'white' }}
			onClick={() => handleClick()}
			title="Confirm deletion"
		>
			<IconTrash />
		</Button>
	);
};

export default ConfirmDeleteUploadButton;
