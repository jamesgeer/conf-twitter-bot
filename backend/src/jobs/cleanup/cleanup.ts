import { readdirSync } from 'fs';
import { getAllUploads } from './cleanup-model';
import { uploadFolder } from '../../routes/util';

const getUploadedMedia = async (): Promise<string[]> =>
	// get all files but ignore directories and the gitignore file
	readdirSync(uploadFolder, { withFileTypes: true })
		.filter((item) => !item.isDirectory() && item.name !== '.gitignore')
		.map((item) => item.name);

export const cleanUp = async (): Promise<string[]> => {
	const filenames = await getUploadedMedia();
	const dbEntries = await getAllUploads();

	// compares the list of filenames to the list of db entries, any filename that is not in
	// dbEntries is returned in a new list
	return filenames.filter((file) => !dbEntries.find((entry) => entry.name === file));
};
