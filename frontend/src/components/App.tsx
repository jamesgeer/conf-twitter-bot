import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Index from './pages/Index';
import Login from './pages/Login';
import TwitterLogin from './pages/TwitterLogin';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
	const [appLoggedIn, setAppLoggedIn] = useState(false);
	const [twitterLoggedIn, setTwitterLoggedIn] = useState(false);
	const [cookies, setCookie] = useCookies(['ConfTwBot']);

	useEffect(() => {
		handleAppLogin().then();
	}, []);

	const handleAppLogin = async () => {
		try {
			const config = {
				xsrfCookieName: 'ConfTwBot',
			};
			const payload = { password: 'appPassword' };
			const response = await axios.post('http://localhost:33333/', payload, config);
			console.log(response);
			console.log(response.headers);

			// setCookie('ConfTwBot', response.headers['x-access-token']);
			// const cookie = cookies.ConfTwBot;
			// console.log(cookie);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Router>
			<Routes>
				{appLoggedIn && <Route path="/" element={<TwitterLogin />} />}
				{twitterLoggedIn && <Route path="/" element={<Index />} />}
				{!appLoggedIn && !twitterLoggedIn && <Route path="/" element={<Login />} />}
			</Routes>
		</Router>
	);
}
