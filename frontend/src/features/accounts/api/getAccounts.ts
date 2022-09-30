import axios from 'axios';
import { Accounts } from '../types';

export const getAccounts = async (): Promise<Accounts> => {
	const response = await axios.get('/api/accounts');
	return response.data;
};
