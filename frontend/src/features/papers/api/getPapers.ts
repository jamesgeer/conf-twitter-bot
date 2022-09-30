import axios from 'axios';
import { Papers } from '../types';

export const getPapers = async (): Promise<Papers> => {
	const response = await axios.get('/api/papers');
	return response.data;
};
