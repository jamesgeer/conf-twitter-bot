import axios from 'axios';

export interface OAuthToken {
	oAuthToken: string;
}

export const getOAuthRequestToken = async (): Promise<OAuthToken> => {
	const response = await axios.get('/api/oauths/twitter/request_token');
	const { oauthToken: oAuthToken } = response.data;
	return oAuthToken;
	// setErrorMessage('Unable to authenticate with server, please try again.');
};
