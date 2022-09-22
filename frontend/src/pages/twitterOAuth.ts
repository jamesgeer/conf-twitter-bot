import axios from 'axios';
import queryString from 'query-string';
import HttpStatus from 'http-status';

// OAuth Step 1: get request token from backend
const getOAuthRequestToken = async () => {
	try {
		const response = await axios.get('/api/oauths/twitter/request_token');
		const { oauthToken: oAuthToken } = response.data;

		if (oAuthToken.length > 0) {
			navigateToTwitterLogin(oAuthToken);
			return;
		}
	} catch (error) {
		console.error(error);
	}

	// setErrorMessage('Unable to authenticate with server, please try again.');
};

// Oauth Step 2: direct user to Twitter's login page
const navigateToTwitterLogin = (oAuthToken: string) => {
	window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oAuthToken}`;
};

// Oauth Step 3: parse access token from url and post to backend
// if successful the user details will be returned
const processAccessToken = async () => {
	const { oauth_token, oauth_verifier } = queryString.parse(window.location.search);
	if (oauth_token && oauth_verifier) {
		try {
			const config = { withCredentials: true };
			const payload = { oauth_token, oauth_verifier };
			const response = await axios.post('/api/oauths/twitter/access_token', payload, config);

			if (response.status === HttpStatus.CREATED) {
				const twitterAccount = response.data;
				console.log(twitterAccount);
				return;
			}

			console.error('Unable to log into Twitter account.');
		} catch (error) {
			console.error(error);
		}
	}

	console.error('Failed to authenticate with Twitter, please try again.');
};
