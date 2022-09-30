import axios from 'axios';
import { Tweets } from '../types';

export const getTweets = async (): Promise<Tweets> => {
	const response = await axios.get('/api/tweets');
	return response.data;
};
