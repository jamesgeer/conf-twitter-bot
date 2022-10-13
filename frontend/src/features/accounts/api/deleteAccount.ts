import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteAccount = async (accountId: number): Promise<any> => {
	return await axios.delete('/api/accounts/' + accountId);
};

export const useDeleteAccount = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteAccount,

		onError: async (_, __, context: any) => {
			if (context?.previousAccounts) {
				await queryClient.setQueryData(['accounts'], context.previousAccounts);
			}
		},

		onSuccess: async () => {
			await queryClient.invalidateQueries(['accounts']);
		},
	});
};
