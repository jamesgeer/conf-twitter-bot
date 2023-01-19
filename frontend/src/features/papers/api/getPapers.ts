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

export const getFilteredPapers = async (payload: PaperSearch): Promise<Papers> => {
	let searchParams = {};

	for (const [key, value] of Object.entries(payload)) {
		console.log(key, value);
		if (value) {
			searchParams = { ...searchParams, [key]: value };
		}
	}

	const response = await axios.get('/api/papers/search', {
		params: searchParams,
	});

	return response.data;
};

export const useSearchPapers = (payload: PaperSearch) => {
	return useQuery<Papers, Error>(['search-results'], () => getFilteredPapers(payload), {
		initialData: [],
	});
};
