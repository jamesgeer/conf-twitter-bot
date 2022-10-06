import * as fs from 'fs';

// Function that writes logs to files
export const logToFile = function (): void {

	const logDateObject = new Date();
	const logDate =  `${logDateObject.getFullYear()}_${logDateObject.getMonth()}_${logDateObject.getDate()}`;

	fs.writeFile(`logging/app_logs/${logDate}.txt`, 'test text',{flag:'a+'}, (err) => {
		if (err) throw err;
		console.log(`Logged action to file ${logDate}.txt`);
	});
};
