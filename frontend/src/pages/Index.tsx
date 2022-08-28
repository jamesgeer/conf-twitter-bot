import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from '../pages/Login';
import AccountSelection from '../pages/AccountSelection';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import HttpStatus from 'http-status';
import Dashboard from '../pages/Dashboard';
import { ActiveAccountContext } from '../context/ActiveAccountContext';
import { ActiveTwitterAccountContext } from '../types';
import SignUp from './SignUp';

export default function Index() {
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
			const response = await axios.get('/api/sessions', config);
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
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/login" element={<Login appLogin={setAppLoggedIn} />} />
					<Route path="/select-account" element={<AccountSelection />} />
					{appLoggedIn && twitterLoggedIn ? (
						<Route path="/" element={<Dashboard />} />
					) : (
						<Route path="/" element={<Login appLogin={setAppLoggedIn} />} />
					)}
				</Routes>
			</Router>
		</>
	);
}
