import { Paper as PaperType } from '../../types';
import {
	Box,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	SimpleGrid,
} from '@chakra-ui/react';
import React from 'react';
import uuid from 'react-uuid';

interface Props {
	paper: PaperType;
	isOpen: boolean;
	onClose: () => void;
}

const PaperModal = ({ paper, isOpen, onClose }: Props) => {
	const paperSourceButton = () => {
		return (
			<Link href={paper.url} isExternal>
				Source
			</Link>
		);
	};

	// maps over array and puts a comma after each author except for the last
	const paperModalAuthors = () => {
		return paper.authors
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
					<Box>{paper.fullAbstract ? paper.fullAbstract : paper.shortAbstract}</Box>
				</ModalBody>
			</SimpleGrid>
		);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent maxW="740px" padding="24px">
				<ModalCloseButton />
				<ModalHeader>{paper.title}</ModalHeader>
				{paperModalContent()}
			</ModalContent>
		</Modal>
	);
};

export default PaperModal;
