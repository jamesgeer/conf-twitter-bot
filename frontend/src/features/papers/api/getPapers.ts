import axios from 'axios';
import { Papers, PaperSearch } from '../types';
import { useQuery } from '@tanstack/react-query';

export const getPapers = async (): Promise<Papers> => {
	const response = await axios.get('/api/papers');
	return response.data;
};

export const getAbstractSummary = async (paperId: string): Promise<string> => {
	const response = await axios.post(`/api/papers/${paperId}/summarise`);
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
		if (value) {
			// add key/value to search query and remove excess whitespace
			searchParams = { ...searchParams, [key]: value.trim() };
		}
	}

	const response = await axios.get('/api/papers/filter/', {
		params: searchParams,
	});

	return response.data;
};

export const useSearchPapers = (payload: PaperSearch) => {
	return useQuery<Papers, Error>(['search-results'], () => getFilteredPapers(payload), {
		initialData: [],
	});
};

export const getAuthorsPapers = async (paperId: number, authorIndex: number): Promise<Papers> => {
	const response = await axios.get(`/api/papers/author`, { params: { paperId, authorIndex } });
	return response.data;
};
