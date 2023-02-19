import axios from 'axios';
import { ScrapeHistory } from '../types';
import { useQuery } from '@tanstack/react-query';

export const getHistory = async (): Promise<ScrapeHistory> => {
    const response = await axios.get('/api/scraper/history');
    return response.data;
};

export const useScrapeHistory = () => {
    return useQuery<ScrapeHistory, Error>(['history'], () => getHistory(), {
        initialData: [],
    });
};
