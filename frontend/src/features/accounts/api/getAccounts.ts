import axios from 'axios';
import { Accounts } from '../types';
import { useQuery } from '@tanstack/react-query';

export const getAccounts = async (): Promise<Accounts> => {
	const response = await axios.get('/api/accounts');
	return response.data;
};

export const useAccounts = () => {
	return useQuery<Accounts, Error>(['accounts'], () => getAccounts(), {
		initialData: [],
	});
};
