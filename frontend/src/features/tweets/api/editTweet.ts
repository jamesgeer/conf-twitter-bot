import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Tweet } from '../types';

interface EditTweetPayload {
	tweetId: number;
	content: string;
	scheduledTimeUTC: string;
}

const editTweet = async (payload: EditTweetPayload): Promise<Tweet> => {
	return await axios.patch('/api/tweets/' + payload.tweetId, payload);
};

export const useEditTweet = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: editTweet,

		onMutate: async (newTweet) => {
			// Cancel any outgoing refetches
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ['tweets', newTweet.tweetId] });

			// Snapshot the previous value
			const previousTweet = queryClient.getQueryData(['tweets', newTweet.tweetId]);

			// Optimistically update to the new value
			queryClient.setQueryData(['tweets', newTweet.tweetId], newTweet);

			// Return a context with the previous and new todo
			return { previousTweet, newTweet };
		},

		// If the mutation fails, use the context we returned above
		onError: (err, newTweet, context) => {
			queryClient.setQueryData(['tweets', context!.newTweet.tweetId], context!.previousTweet);
		},

		// Always refetch after error or success:
		onSettled: (newTweet) => {
			queryClient.invalidateQueries({ queryKey: ['tweets', newTweet!.id] });
		},
	});
};
