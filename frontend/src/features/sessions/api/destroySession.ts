import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const destroySession = async (): Promise<void> => {
	await axios.post('/api/sessions/logout');
};

export const useDestroySession = async () => {
	const queryClient = useQueryClient();

	await destroySession().then(() => queryClient.clear());
};
