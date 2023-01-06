import axios from 'axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { HTTPTweet, Tweet } from '../types';

const createTweet = async (payload: HTTPTweet): Promise<Tweet> => {
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
