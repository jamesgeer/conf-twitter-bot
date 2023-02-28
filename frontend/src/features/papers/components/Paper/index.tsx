import { Paper as PaperType } from '../../types';
import { IconSparkles } from '@tabler/icons-react';
import { Text } from '@chakra-ui/react';
import { IconCalendar, IconUsers, IconStack, IconTimeline } from '@tabler/icons';
import React, { useState } from 'react';
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
	Flex,
} from '@chakra-ui/react';
import uuid from 'react-uuid';
import { getAbstract } from '../../api/getPapers';

interface Props {
	paper: PaperType;
}

const Paper = ({ paper }: Props) => {
	const { title, authors, url, shortAbstract, fullAbstract, id } = paper;
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [summary, setSummary] = useState('');
	const [isSummarising, setIsSummarising] = useState(false);

	const handleButtonClick = async () => {
		setIsSummarising(true);
		const summarised = await getAbstract(id.toString());
		setSummary(summarised);
		setIsSummarising(false);
	};

	const paperSourceButton = () => {
		return (
			<Link href={url} isExternal>
				Source
			</Link>
		);
	};

	// maps over array and puts a comma after each author except for the last
	const paperModalAuthors = () => {
		return authors
			.map<React.ReactNode>((author) => {
				// TODO: internal link to display author's papers
				return (
					<Link key={uuid()} href="#">
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
						<Box>
							{paper.monthYear && `Published: ${paper.monthYear},`}{' '}
							{paper.pages && `Pages: ${paper.pages},`}{' '}
							{paper.downloads && `Downloads: ${paper.downloads}`}
						</Box>
					</Box>
					<Flex direction={'column'}>
						{fullAbstract ? fullAbstract : shortAbstract}
						<Button mt={4} mb={4} isLoading={isSummarising} onClick={handleButtonClick}>
							<IconSparkles />
						</Button>
						{summary ? (
							<>
								<Text as="b">Summary: </Text>
								{summary}
							</>
						) : (
							''
						)}
					</Flex>
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
				{paper.monthYear && (
					<Box className="flex" title="Publish date">
						<IconCalendar className="mr-1" /> {paper.monthYear}
					</Box>
				)}
				<Box className="flex" title="Authors">
					<IconUsers className="mr-1" /> {authors.length}
				</Box>
				{paper.pages && (
					<Box className="flex" title="Pages">
						<IconStack className="mr-1" /> {paper.pages}
					</Box>
				)}
				{paper.downloads && (
					<Box className="flex" title="Downloads">
						<IconTimeline className="mr-1" /> {paper.downloads}
					</Box>
				)}
			</HStack>
			{paperModal()}
		</Box>
	);
};

export default Paper;
