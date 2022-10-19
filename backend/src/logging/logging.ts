import * as fs from 'fs';

export const initLogToFile = (): void => {
	const dir = 'logging/app_logs';
	// create folder for logs
	fs.mkdir(dir, { recursive: true }, (err) => {
		if (err) console.log(err);
	});
};

export const logToFile = (errorLog: any): string => {
	const logDateObject = new Date();
	// construct file name (yyyy-mm-dd.txt is the format)
	const logDate = `${logDateObject.getFullYear()}_${logDateObject.getMonth()}_${logDateObject.getDate()}`;

	fs.writeFile(`logging/app_logs/${logDate}.txt`, errorLog, { flag: 'a+' }, (err) => {
		if (err) console.log(err);
	});
	return `Logged action to file ${logDate}.txt`;
};
