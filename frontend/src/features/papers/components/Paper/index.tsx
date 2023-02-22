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
	Link as ChakraLink,
} from '@chakra-ui/react';
import uuid from 'react-uuid';
import { Link } from 'react-router-dom';

interface Props {
	paper: PaperType;
}

const Paper = ({ paper }: Props) => {
	const { title, authors, url, shortAbstract, fullAbstract } = paper;
	const { isOpen, onOpen, onClose } = useDisclosure();

	const paperSourceButton = () => {
		return (
			<ChakraLink href={url} isExternal>
				Source
			</ChakraLink>
		);
	};

	// maps over array and puts a comma after each author except for the last
	const paperModalAuthors = () => {
		return authors
			.map<React.ReactNode>((author) => {
				// TODO: internal link to display author's papers
				return (
					//changing to react Link ruined styling of link
					<Link key={uuid()} to={'/papers/' + author.replace(' ', '-').toLowerCase()}>
						{author}
					</Link>
				);
			})
			.reduce((prev, curr) => [prev, ', ', curr]);
	};

	const paperModalContent = () => {
		return (
			<SimpleGrid>
				<ModalBody>
					<Box paddingBottom="24px">
						<Box>{paperSourceButton()}</Box>
						<Box>{paperModalAuthors()}</Box>
						<Box>Published: March 2021, Pages: 10-15, Downloads: 76</Box>
					</Box>
					<Box>{fullAbstract ? fullAbstract : shortAbstract}</Box>
				</ModalBody>
			</SimpleGrid>
		);
	};

	const paperModal = () => {
		return (
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent maxW="740px" padding="24px">
					<ModalCloseButton />
					<ModalHeader>{title}</ModalHeader>
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
				<Box className="flex" title="Publish date">
					<IconCalendar className="mr-1" /> Mar '21
				</Box>
				<Box className="flex" title="Authors">
					<IconUsers className="mr-1" /> {authors.length}
				</Box>
				<Box className="flex" title="Pages">
					<IconStack className="mr-1" /> 10-15
				</Box>
				<Box className="flex" title="Downloads">
					<IconTimeline className="mr-1" /> 76
				</Box>
			</HStack>
			{paperModal()}
		</Box>
	);
};

export default Paper;
