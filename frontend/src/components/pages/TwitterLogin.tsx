import axios from 'axios';
import { useEffect, useState } from 'react';
import queryString from 'query-string';

const TwitterLogin = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [name, setName] = useState();
	const [imageUrl, setImageUrl] = useState();
	const [status, setStatus] = useState();
	const [url, setUrl] = useState();

	useEffect(() => {
		(async () => {
			const { oauth_token, oauth_verifier } = queryString.parse(window.location.search);
			console.log(oauth_token);
			console.log(oauth_verifier);

			if (oauth_token && oauth_verifier) {
				try {
					const config = { withCredentials: true };
					const payload = { oauth_token, oauth_verifier };
					await axios.post('/api/twitter/oauth/access_token', payload, config);
				} catch (error) {
					console.error(error);
				}
			}
		})();
	}, []);

	const login = async () => {
		try {
			// OAuth Step 1: retrieve request token from backend
			const response = await axios.get('/api/twitter/oauth/request_token');
			const { oauthToken } = response.data;

			// Oauth Step 2: direct user to Twitter's login page
			window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;
		} catch (error) {
			console.error(error);
		}
	};

	const logout = async () => {
		try {
			await axios({
				url: '/api/twitter/logout',
				method: 'POST',
			});
			setIsLoggedIn(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			{!isLoggedIn && (
				<img
					className="signin-btn"
					onClick={login}
					alt="Twitter login button"
					src="https://assets.klaudsol.com/twitter.png"
				/>
			)}
			{isLoggedIn && (
				<div>
					<div>
						<img alt="User profile" src={imageUrl} />
					</div>
					<div>Name: {name}</div>
					<div>URL: {url}</div>
					<div>Status: {status}</div>
					<button className="signout-btn" onClick={logout}>
						Sign Out
					</button>
				</div>
			)}
		</div>
	);
};

export default TwitterLogin;
