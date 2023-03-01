import { Button } from '@chakra-ui/react';
import { IconArrowBackUp } from '@tabler/icons-react';
import React from 'react';

interface Props {
	handleClick: () => void;
}

const RevertDeleteButton = ({ handleClick }: Props) => {
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
			_hover={{ bg: 'DodgerBlue', color: 'white' }}
			onClick={() => handleClick()}
			title="Undo deletion"
		>
			<IconArrowBackUp />
		</Button>
	);
};

export default RevertDeleteButton;
