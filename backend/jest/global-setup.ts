import { existsSync, mkdirSync } from 'fs';
import { uploadFolder } from '../src/routes/util';

/**
 * this methods will be run before all jest tests
 *
 * currently creates a test upload folder if it doesn't already exist
 */
const jestGlobalSetup = (): void => {
	if (!existsSync(uploadFolder)) {
		mkdirSync(uploadFolder);
		console.log(`jestGlobalSetup: ${uploadFolder}`);
	}
};

export default jestGlobalSetup;
