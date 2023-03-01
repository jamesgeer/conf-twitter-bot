import { Paper as PaperType } from '../../types';
import { Text } from '@chakra-ui/react';
import { IconCalendar, IconUsers, IconStack, IconTimeline } from '@tabler/icons-react';
import React from 'react';
import { Heading, Box, HStack, useDisclosure } from '@chakra-ui/react';
import PaperModal from './PaperModal';

interface Props {
	paper: PaperType;
}

const Paper = ({ paper }: Props) => {
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
				{paper.title}
			</Heading>
			<HStack spacing="24px" className="mt-3">
				{paper.monthYear && (
					<Box className="flex" title="Publish date">
						<IconCalendar className="mr-1" /> {paper.monthYear}
					</Box>
				)}
				<Box className="flex" title="Authors">
					<IconUsers className="mr-1" /> {paper.authors.length}
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
			{isOpen && <PaperModal paper={paper} isOpen={isOpen} onClose={onClose} />}
		</Box>
	);
};

export default Paper;
