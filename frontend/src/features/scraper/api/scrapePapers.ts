import axios from 'axios';

export const scrapePapers = async (): Promise<string> => {
	const response = await axios.post('/api/scraper/');
	return response.data;
};
