import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Index from './pages/Index';
import Login from './pages/Login';
import TwitterLogin from './pages/TwitterLogin';
import SelectAccount from './pages/SelectAccount';
import { useEffect, useState } from 'react';
import axios from 'axios';
import HttpStatus from 'http-status';

export default function App() {
	const [appLoggedIn, setAppLoggedIn] = useState(false);
	const [twitterLoggedIn, setTwitterLoggedIn] = useState(false);

	useEffect(() => {
		// check if there is an existing user session on start up
		// need a better implementation
		if (!appLoggedIn) {
			existingSession().then();
		}
	}, [appLoggedIn]);

	const existingSession = async (): Promise<void> => {
		try {
			const config = {
				withCredentials: true,
			};
			const response = await axios.get('/api/session', config);
			if (response.status === HttpStatus.OK) {
				setAppLoggedIn(true);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="container mx-auto flex justify-center">
			<Router>
				<Routes>
					{appLoggedIn && <Route path="/" element={<SelectAccount />} />}
					{twitterLoggedIn && <Route path="/" element={<Index />} />}
					{!appLoggedIn && !twitterLoggedIn && (
						<Route path="/" element={<Login appLogin={setAppLoggedIn} />} />
					)}
				</Routes>
			</Router>
		</div>
	);
}
