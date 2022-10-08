import axios from 'axios';
import { Papers } from '../types';
import { useQuery } from '@tanstack/react-query';

export const getPapers = async (): Promise<Papers> => {
	const response = await axios.get('/api/papers');
	return response.data;
};

export const usePapers = () => {
	return useQuery<Papers, Error>(['papers'], () => getPapers(), {
		initialData: [],
	});
};
