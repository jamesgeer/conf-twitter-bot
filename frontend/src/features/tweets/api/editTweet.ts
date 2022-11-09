import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const editTweet = async (tweetId: number): Promise<any> => {
	return await axios.patch('/api/tweets/' + tweetId);
};

export const useEditTweet = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: editTweet,

		onError: async (_, __, context: any) => {
			if (context?.previousTweets) {
				await queryClient.setQueryData(['tweets'], context.previousTweets);
			}
		},

		onSuccess: async () => {
			await queryClient.invalidateQueries(['tweets']);
		},
	});
};
