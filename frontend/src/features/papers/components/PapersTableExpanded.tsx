import { Paper } from '../types';
import { Box, Button, ModalBody, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import PaperModal from './Paper/PaperModal';
import React from 'react';
import { IconArrowsDiagonal2 } from '@tabler/icons';

interface Props {
	paper: Paper;
}

const PapersTableExpanded = ({ paper }: Props) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<SimpleGrid columns={2} spacing={10}>
			<Box>{paper.fullAbstract ? paper.fullAbstract : paper.shortAbstract}</Box>
			<Box>
				<Button onClick={onOpen}>
					<IconArrowsDiagonal2 />
				</Button>
				{/*<Box>{paperSourceButton()}</Box>*/}
				{/*<Box>{paperModalAuthors()}</Box>*/}
				<Box>
					{paper.monthYear && `Published: ${paper.monthYear},`} {paper.pages && `Pages: ${paper.pages},`}{' '}
					{paper.downloads && `Downloads: ${paper.downloads}`}
				</Box>
			</Box>
			{isOpen && <PaperModal paper={paper} isOpen={isOpen} onClose={onClose} />}
		</SimpleGrid>
	);
};

export default PapersTableExpanded;
