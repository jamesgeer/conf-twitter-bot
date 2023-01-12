import { Upload, Uploads } from '../types';
import { SimpleGrid, Box, useDisclosure, Image } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalCloseButton } from '@chakra-ui/react';

const DisplayUploads = ({ uploads }: { uploads: Uploads }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const media = uploads.map((upload: Upload) => {
		return (
			<Image
				key={upload.name}
				objectFit="cover"
				borderRadius="1rem"
				minHeight="100%"
				src={upload.url}
				alt={upload.alt}
				onClick={onOpen}
			/>
		);
	});

	/*
					<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent maxWidth={'fit-content'}>
						<ModalCloseButton />
						<Image src={upload.url} alt={upload.alt} />
					</ModalContent>
				</Modal>
	 */

	return (
		<SimpleGrid columns={4} spacing={10} paddingTop={'1rem'}>
			{media}
		</SimpleGrid>
	);
};

export default DisplayUploads;
