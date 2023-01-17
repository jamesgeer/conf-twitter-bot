import { Upload, Uploads } from '../types';
import { SimpleGrid } from '@chakra-ui/react';
import UploadModal from './UploadModal';

const UploadsList = ({ uploads }: { uploads: Uploads }) => {
	return (
		<SimpleGrid columns={4} spacing={10} paddingTop="1rem">
			{uploads.map((upload: Upload) => (
				<UploadModal key={upload.name} upload={upload} />
			))}
		</SimpleGrid>
	);
};

export default UploadsList;
