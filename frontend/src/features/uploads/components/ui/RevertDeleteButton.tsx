import { Button } from '@chakra-ui/react';
import { IconArrowBackUp } from '@tabler/icons';
import React from 'react';

interface Props {
	handleClick: () => void;
}

const RevertDeleteButton = ({ handleClick }: Props) => {
	return (
		<Button
			bg="grey"
			variant="solid"
			position="absolute"
			left="2"
			top="2"
			size="xs"
			padding="5px"
			height="initial"
			borderRadius="full"
			_hover={{ bg: 'blue', color: 'white' }}
			onClick={() => handleClick()}
		>
			<IconArrowBackUp />
		</Button>
	);
};

export default RevertDeleteButton;
