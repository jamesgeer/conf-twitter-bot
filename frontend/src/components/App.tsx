import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import SelectAccount from './pages/SelectAccount';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import HttpStatus from 'http-status';
import Dashboard from './pages/Dashboard';
import { ActiveAccountContext } from '../context/ActiveAccountContext';
import { ActiveTwitterAccountContext } from '../types/twitter-types';

export default function App() {
	const [appLoggedIn, setAppLoggedIn] = useState(false);
	const [twitterLoggedIn, setTwitterLoggedIn] = useState(false);

	const { activeAccount } = useContext(ActiveAccountContext) as ActiveTwitterAccountContext;

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
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// @ts-ignore
				console.error(error.response.data.message);
			}
		}
	};

	if (!twitterLoggedIn && activeAccount.userId.length > 0) {
		setTwitterLoggedIn(true);
	}

	return (
		<>
			<Router>
				<Routes>
					{appLoggedIn && twitterLoggedIn && <Route path="/" element={<Dashboard />} />}
					{appLoggedIn && <Route path="/" element={<SelectAccount />} />}
					{!appLoggedIn && !twitterLoggedIn && (
						<Route path="/" element={<Login appLogin={setAppLoggedIn} />} />
					)}
				</Routes>
			</Router>
		</>
	);
}
