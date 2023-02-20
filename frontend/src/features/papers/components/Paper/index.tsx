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
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	SimpleGrid,
	Button,
	Link,
} from '@chakra-ui/react';

interface Props {
	paper: PaperType;
}

const Paper = ({ paper }: Props) => {
	const { title, authors, url, shortAbstract, fullAbstract } = paper;
	const { isOpen, onOpen, onClose } = useDisclosure();

	const paperSourceButton = () => {
		let buttonText;

		switch (paper.source) {
			case 'acm':
				buttonText = 'ACM';
				break;

			case 'researchr':
				buttonText = 'ResearchR';
				break;

			default:
				buttonText = 'SRC';
		}

		return (
			<Link href={url} isExternal>
				<Button colorScheme="gray">{buttonText}</Button>
			</Link>
		);
	};

	const paperModalContent = () => {
		return (
			<SimpleGrid>
				<ModalHeader></ModalHeader>
				<ModalBody>
					<Box>
						<Heading as="h2" size="md">
							{title}
						</Heading>
						<Box>{paperSourceButton()}</Box>
					</Box>
					<Box>
						<Heading as="h6" size="xs">
							{fullAbstract ? 'Full Abstract' : 'Short Abstract'}
						</Heading>
						{fullAbstract ? fullAbstract : shortAbstract}
					</Box>
				</ModalBody>
			</SimpleGrid>
		);
	};

	const paperModal = () => {
		return (
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					{paperModalContent()}
				</ModalContent>
			</Modal>
		);
	};

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
			{paperModal()}
		</Box>
	);
};

export default Paper;
