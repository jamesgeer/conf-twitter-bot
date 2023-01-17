import { Box, Image, useDisclosure } from '@chakra-ui/react';
import { Upload } from '../types';
import { Modal, ModalOverlay, ModalContent, ModalCloseButton } from '@chakra-ui/react';

const UploadModal = ({ upload }: { upload: Upload }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Box position="relative" display="flex" justifyContent="center" height="178px">
			<Image
				objectFit="cover"
				borderRadius="1rem"
				cursor="pointer"
				width="100%"
				src={upload.url}
				alt={upload.alt}
				onClick={onOpen}
			/>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent maxWidth="fit-content">
					<ModalCloseButton />
					<Image src={upload.url} alt={upload.alt} />
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default UploadModal;
