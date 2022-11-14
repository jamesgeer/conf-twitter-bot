import { Papers } from '../papers/papers';
import { logToFile } from '../../logging/logging';

let papers: Papers = [];
export const scrapePaper = (urls: any): Papers => {
	try {
		console.log(urls);
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		papers = [];
	}
	return papers;
};
