import { Paper as PaperType } from '../../types';
import { IconCalendar, IconUsers, IconStack, IconTimeline } from '@tabler/icons';
import React from 'react';
import {
	Heading,
	Box,
	HStack,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
} from '@chakra-ui/react';

interface Props {
	paper: PaperType;
}

const Paper = ({ paper }: Props) => {
	const { title, authors, shortAbstract, url } = paper;
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box
			borderWidth="1px"
			rounded="md"
			padding="5"
			_hover={{ bg: 'var(--chakra-colors-gray-100)', cursor: 'pointer' }}
			onClick={onOpen}
		>
			<Heading as="h4" size="md">
				{title}
			</Heading>
			<HStack spacing="24px" className="mt-3">
				<Box className="flex">
					<IconCalendar className="mr-1" /> Mar '21
				</Box>
				<Box className="flex">
					<IconUsers className="mr-1" /> {authors.length}
				</Box>
				<Box className="flex">
					<IconStack className="mr-1" /> 10-15
				</Box>
				<Box className="flex">
					<IconTimeline className="mr-1" /> 76
				</Box>
			</HStack>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent maxWidth="fit-content">
					<ModalCloseButton />
					{paper.fullAbstract}
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default Paper;
