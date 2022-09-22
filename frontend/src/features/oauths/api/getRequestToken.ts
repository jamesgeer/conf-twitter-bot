import axios from 'axios';

const getOAuthRequestToken = async (): Promise<string> => {
	const response = await axios.get('/api/oauths/twitter/request_token');
	const { oauthToken: oAuthToken } = response.data;
	return oAuthToken;
	// setErrorMessage('Unable to authenticate with server, please try again.');
};
