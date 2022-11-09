import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const getUserSession = async (): Promise<number> => {
	return await axios.get('/api/sessions/');
};

export const useUseSession = () => {
	return useQuery<number, Error>(['user-session'], () => getUserSession(), {
		initialData: 0,
	});
};
