import * as fs from 'fs';

// Function that writes logs to files
export const logToFile = (errorLog: any): string => {
	const logDateObject = new Date();
	// construct file name (yyyy-mm-dd.txt is the format)
	const logDate = `${logDateObject.getFullYear()}_${logDateObject.getMonth()}_${logDateObject.getDate()}`;

	// eslint-disable-next-line consistent-return
	fs.writeFile(`logging/app_logs/${logDate}.txt`, errorLog, { flag: 'a+' }, (err) => {
		if (err) return err;
	});
	return `Logged action to file ${logDate}.txt`;
};
