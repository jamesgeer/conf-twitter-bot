import axios from 'axios';
import HttpStatus from 'http-status';
import { AccessToken } from '../types';
import { TwitterUser } from '../../accounts/types';

export const createAccessToken = async (accessToken: AccessToken): Promise<TwitterUser | null> => {
	const config = { withCredentials: true };
	const payload = {
		token: accessToken.token,
		verifier: accessToken.verifier,
	};
	const response = await axios.post('/api/oauths/twitter/access_token', payload, config);

	if (response.status === HttpStatus.CREATED) {
		const result = response.data;
		console.log(result);
		return result;
	}

	console.error('Unable to log into Twitter account.');
	return null;
};
