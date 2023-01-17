import axios from 'axios';
import { HTTPTweet, Tweet } from '../../tweets/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface tweetMediaPayload {
	tweetPayload: HTTPTweet;
	mediaPayload: FormData;
}

const editTweetWithUpload = async ({ tweetPayload, mediaPayload }: tweetMediaPayload): Promise<Tweet> => {
	const tweetId = tweetPayload.tweetId;
	await axios.patch(`/api/tweets/${tweetId}`, tweetPayload);
	return await axios.post(`/api/uploads/tweet/${tweetId}`, mediaPayload);
};

export const useEditTweetWithUpload = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: editTweetWithUpload,

		onMutate: async (newTweet) => {
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
