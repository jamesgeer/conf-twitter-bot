import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPTweet, Tweet } from '../types';

const editTweet = async (payload: HTTPTweet): Promise<Tweet> => {
	return await axios.patch('/api/tweets/' + payload.tweetId, payload);
};

export const useEditTweet = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: editTweet,

		onMutate: async (newTweet) => {
			// Cancel any outgoing refetches
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ['tweets'] });

			// Snapshot the previous value
			const previousTweet = queryClient.getQueryData(['tweets']);

			// Optimistically update to the new value
			queryClient.setQueryData(['tweets'], newTweet);

			// Return a context with the previous and new todo
			return { previousTweet, newTweet };
		},

		// If the mutation fails, use the context we returned above
		onError: (err, newTweet, context) => {
			// @ts-ignore
			queryClient.setQueryData(['tweets'], context!.previousTweet);
		},

		// Always refetch after error or success:
		onSettled: (newTweet) => {
			queryClient.invalidateQueries({ queryKey: ['tweets'] });
		},
	});
};
