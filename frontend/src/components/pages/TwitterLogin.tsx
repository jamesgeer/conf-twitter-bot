import axios from 'axios';
import { useState, useEffect } from 'react';
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
					//Oauth Step 3
					await axios({
						url: '/api/twitter/oauth/access_token',
						method: 'POST',
						data: { oauth_token, oauth_verifier },
					});
				} catch (error) {
					console.error(error);
				}
			}

			// try {
			// 	//Authenticated Resource Access
			// 	const {
			// 		data: { name, profile_image_url_https, status, entities },
			// 	} = await axios({
			// 		url: '/api/twitter/users/profile_banner',
			// 		method: 'GET',
			// 	});
			//
			// 	setIsLoggedIn(true);
			// 	setName(name);
			// 	setImageUrl(profile_image_url_https);
			// 	setStatus(status.text);
			// 	setUrl(entities.url.urls[0].expanded_url);
			// } catch (error) {
			// 	console.error(error);
			// }
		})();
	}, []);

	const login = () => {
		(async () => {
			try {
				//OAuth Step 1
				const response = await axios({
					url: '/api/twitter/oauth/request_token',
					method: 'POST',
				});

				const { oauth_token } = response.data;
				//Oauth Step 2
				window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
			} catch (error) {
				console.error(error);
			}
		})();
	};

	const logout = () => {
		(async () => {
			try {
				await axios({
					url: '/api/twitter/logout',
					method: 'POST',
				});
				setIsLoggedIn(false);
			} catch (error) {
				console.error(error);
			}
		})();
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
