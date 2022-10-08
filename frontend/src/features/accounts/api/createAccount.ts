import { AccessToken } from '../../oauths/types';
import { Account } from '../types';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createAccount = async (accessToken: AccessToken): Promise<Account | null> => {
	const config = { withCredentials: true };
	const payload = {
		token: accessToken.token,
		verifier: accessToken.verifier,
	};

	return await axios.post('/api/oauths/twitter/access_token', payload, config);
};

export const useCreateAccount = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createAccount,

		onError: async (_, __, context: any) => {
			if (context?.previousTweets) {
				await queryClient.setQueryData(['accounts'], context.previousTweets);
			}
		},

		onSuccess: async () => {
			await queryClient.invalidateQueries(['accounts']);
		},
	});
};
