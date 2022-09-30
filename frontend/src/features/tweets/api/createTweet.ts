import axios from 'axios';

interface CreateTweetPayload {
	accountId: number;
	twitterUserId: bigint;
	scheduledTimeUTC: string;
	content: string;
}

export const createTweet = async (payload: CreateTweetPayload): Promise<number> => {
	const response = await axios.post('/api/tweets', payload);
	return response.status;
};
