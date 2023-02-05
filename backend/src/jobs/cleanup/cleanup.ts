import path from 'path';
import appRoot from 'app-root-path';
import { readdirSync } from 'fs';
import { getAllUploads } from './cleanup-model';

const getUploadedMedia = async (): Promise<string[]> => {
	const uploadDirPath = path.join(appRoot.path, 'public', 'uploads');

	// get all files but ignore directories and the gitignore file
	return readdirSync(uploadDirPath, { withFileTypes: true })
		.filter((item) => !item.isDirectory() && item.name !== '.gitignore')
		.map((item) => item.name);
};

export const cleanUp = async (): Promise<void> => {
	const uploadedFilenames = await getUploadedMedia();
	const uploadedDbEntries = await getAllUploads();

	const difference = uploadedDbEntries.filter((x) => !uploadedFilenames.includes(x.name));
	console.log(difference);
};
