import { Upload, Uploads } from '../types';
import { SimpleGrid, Box, Image } from '@chakra-ui/react';

const DisplayUploads = ({ uploads }: { uploads: Uploads }) => {
	const media = uploads.map((upload: Upload) => {
		return <Image key={upload.name} objectFit="cover" borderRadius="1rem" src={upload.url} alt={upload.alt} />;
	});

	return (
		<SimpleGrid columns={4} spacing={10} paddingTop={'1rem'}>
			{media}
		</SimpleGrid>
	);
};

export default DisplayUploads;
