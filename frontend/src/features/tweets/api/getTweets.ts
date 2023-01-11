import axios from 'axios';
import { Tweets } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { AccountContext } from '../../accounts/context/AccountContext';
import { AccountContextProps } from '../../accounts/types';

const getTweets = async (twitterUserId: bigint): Promise<Tweets> => {
	const { data } = await axios.get(`/api/twitter-users/${twitterUserId}/tweets`);
	return data;
};

export const useTweets = () => {
	const {
		account: {
			twitterUser: { id: twitterUserId },
		},
	} = useContext(AccountContext) as AccountContextProps;
	return useQuery<Tweets, Error>(['tweets', twitterUserId], () => getTweets(twitterUserId), {
		initialData: [],
	});
};
