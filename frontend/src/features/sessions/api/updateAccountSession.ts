import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Account } from '../../accounts/types';
import HttpStatus from 'http-status';

const updateAccountSession = async (account: Account): Promise<Account | null> => {
	const payload = { accountId: account.id, userId: account.userId, twitterUserId: account.twitterUser.id };

	const result = await axios.post('/api/sessions/account', payload);
	if (result.status === HttpStatus.OK) {
		return account;
	}
	return null;
};

export const useUpdateAccountSession = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateAccountSession,

		onError: async (_, __, context: any) => {
			if (context?.previousAccounts) {
				await queryClient.setQueryData(['account-session'], context.previousAccounts);
			}
		},

		onSuccess: async (data) => {
			await queryClient.setQueryData(['account-session'], data);
			await queryClient.invalidateQueries(['tweets']);
			await queryClient.invalidateQueries(['papers']);
		},
	});
};
