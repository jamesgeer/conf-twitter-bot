import axios from 'axios';
import HttpStatus from 'http-status';

export const createAccessToken = async (): Promise<void> => {
	const config = { withCredentials: true };
	const payload = { oauth_token, oauth_verifier };
	const response = await axios.post('/api/oauths/twitter/access_token', payload, config);

	if (response.status === HttpStatus.CREATED) {
		const twitterAccount = response.data;
		console.log(twitterAccount);
		return;
	}

	console.error('Unable to log into Twitter account.');
};
