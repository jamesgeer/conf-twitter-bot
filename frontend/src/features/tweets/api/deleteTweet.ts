import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteTweet = async (tweetId: number): Promise<any> => {
	return await axios.delete('/api/tweets/' + tweetId);
};

export const useDeleteTweet = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTweet,

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
