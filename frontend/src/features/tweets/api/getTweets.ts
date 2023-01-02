import axios from 'axios';
import { Tweets } from '../types';
import { useQuery } from '@tanstack/react-query';

const getTweets = async (): Promise<Tweets> => {
	const { data } = await axios.get('/api/tweets');
	return data;
};

export const useTweets = () => {
	return useQuery<Tweets, Error>(['tweets'], () => getTweets(), {
		initialData: [],
	});
};
