import axios from 'axios';
import { Papers, PaperSearch } from '../types';
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

const searchPapers = async (payload: PaperSearch): Promise<Papers> => {
	const response = await axios.get('/api/papers/search', { params: { payload } });
	return response.data;
};

export const useSearchPapers = (payload: PaperSearch) => {
	return useQuery<Papers, Error>(['search-results'], () => searchPapers(payload), {
		initialData: [],
	});
};
