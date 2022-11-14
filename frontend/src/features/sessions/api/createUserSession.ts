import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UserLogin {
	username: string;
	password: string;
}
const createUserSession = async (userLogin: UserLogin): Promise<number> => {
	const config = {
		withCredentials: true,
	};
	const payload = { username: userLogin.username, password: userLogin.password };
	return await axios.post('/api/sessions', payload, config);
};

export const useCreateUserSession = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// @ts-ignore
		mutationFn: createUserSession,

		onSuccess: async (response, variables) => {
			// @ts-ignore
			await queryClient.setQueryData(['user-session'], response.data);
		},
	});
};
