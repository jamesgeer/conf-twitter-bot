import { readdirSync } from 'fs';
import { getAllUploads } from './cleanup-model';
import { uploadFolder } from '../../routes/util';
import { APP_URL } from '../../keys';
import { deleteUploadFile } from '../../routes/uploads/uploads-model';

const getUploadedMedia = async (): Promise<string[]> =>
	// get all files but ignore directories and the gitignore file
	readdirSync(uploadFolder, { withFileTypes: true })
		.filter((item) => !item.isDirectory() && item.name !== '.gitignore')
		.map((item) => item.name);

export const getFilesToBeDeleted = async (): Promise<string[]> => {
	const filenames = await getUploadedMedia();
	const dbEntries = await getAllUploads();

	// returns a new list containing filenames that are not in the database, or if the url is different
	// from the one set for this application (so image is hosted elsewhere)
	return filenames.filter((filename) => {
		const matchingEntry = dbEntries.find((entry) => entry.name === filename);
		return !matchingEntry || !matchingEntry.url.includes(APP_URL);
	});
};

const cleanupSchedule = async (): Promise<void> => {
	const files = await getFilesToBeDeleted();

	if (files.length === 0) {
		return;
	}

	for (const file of files) {
		await deleteUploadFile(file)
			.then(() => console.log(`CLEANUP_CRON: Deleted ${file}`))
			.catch((error) => console.error(`CLEANUP_CRON: Error deleting ${file}: ${error}`));
	}
};

export default cleanupSchedule;
