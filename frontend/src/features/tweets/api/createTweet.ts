import axios from 'axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';

interface CreateTweetPayload {
	accountId: number;
	twitterUserId: bigint;
	scheduledTimeUTC: string;
	content: string;
}

export const createTweet = async (payload: CreateTweetPayload): Promise<number> => {
	return await axios.post('/api/tweets', payload);
};

export const useCreateTweet = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTweet,

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
