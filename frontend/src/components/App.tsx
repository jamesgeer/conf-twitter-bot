import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Index from './pages/Index';
import Login from './pages/Login';
import TwitterLogin from './pages/TwitterLogin';
import { useEffect, useState } from 'react';
import axios from 'axios';
import HttpStatus from 'http-status';

export default function App() {
	const [appLoggedIn, setAppLoggedIn] = useState(false);
	const [twitterLoggedIn, setTwitterLoggedIn] = useState(false);

	useEffect(() => {
		handleAppLogin().then();
	}, []);

	const handleAppLogin = async () => {
		try {
			const config = {
				withCredentials: true,
			};
			const payload = { password: 'appPassword' };
			const response = await axios.post('http://localhost:33333/', payload, config);
			if (response.status === HttpStatus.OK) {
				setAppLoggedIn(true);
			}
			console.log(response);
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
