import queryString from 'query-string';
import axios from 'axios';
import HttpStatus from 'http-status';

const TwitterAuthComplete = () => {
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
};

export default TwitterAuthComplete;
