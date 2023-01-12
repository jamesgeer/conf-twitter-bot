import { Image, useDisclosure } from '@chakra-ui/react';
import { Upload } from '../types';
import { Modal, ModalOverlay, ModalContent, ModalCloseButton } from '@chakra-ui/react';

const UploadModal = ({ upload }: { upload: Upload }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Image
				objectFit="cover"
				borderRadius="1rem"
				minHeight="100%"
				cursor="pointer"
				src={upload.url}
				alt={upload.alt}
				onClick={onOpen}
			/>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent maxWidth={'fit-content'}>
					<ModalCloseButton />
					<Image src={upload.url} alt={upload.alt} />
				</ModalContent>
			</Modal>
		</>
	);
};

export default UploadModal;
