import axios from 'axios';
import { RequestToken } from '../types';

export const getOAuthRequestToken = async (): Promise<RequestToken> => {
	const response = await axios.get('/api/oauths/twitter/request_token');
	const { oauthToken: token } = response.data;
	return token;
	// setErrorMessage('Unable to authenticate with server, please try again.');
};
