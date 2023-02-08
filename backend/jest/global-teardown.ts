import { existsSync, rmSync } from 'fs';
import { uploadFolder } from '../src/routes/util';

/**
 * this methods will be run after all jest tests
 *
 * deletes the test upload folder if it exists
 */
const jestGlobalTeardown = (): void => {
	if (!existsSync(uploadFolder)) {
		return;
	}

	rmSync(uploadFolder, { recursive: true, force: true });
};

export default jestGlobalTeardown;
