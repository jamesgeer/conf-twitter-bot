import axios from 'axios';
import { HTTPTweet, Tweet } from '../../tweets/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface tweetMediaPayload {
	tweetPayload: HTTPTweet;
	mediaPayload: FormData;
}

/**
 * dependant query: requires a tweet to be created before attached media can be uploaded
 * steps: create tweet -> tweet id returned -> create uploads using tweet id -> return new tweet object -> done
 *
 * @param tweetPayload
 * @param mediaPayload
 */
const createTweetWithUpload = async ({ tweetPayload, mediaPayload }: tweetMediaPayload): Promise<Tweet> => {
	const response = await axios.post('/api/tweets', tweetPayload); // create tweet
	const tweet: Tweet = response.data; // convert response into tweet type

	// using returned tweet id, post attached media
	return await axios.post(`/api/uploads/tweet/${tweet.id}`, mediaPayload);
};

export const useCreateTweetWithUpload = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTweetWithUpload,

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
