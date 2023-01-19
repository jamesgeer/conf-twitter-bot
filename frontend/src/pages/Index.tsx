import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '../pages/Login';
import PageNotFound from '../pages/PageNotFound';
import SelectAccount from './SelectAccount';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import HttpStatus from 'http-status';
import Dashboard from '../pages/Dashboard';
import SignUp from './SignUp';
import LoginSuccess from '../features/oauths/components/LoginSuccess';
import { AccountContext } from '../features/accounts/context/AccountContext';
import { AccountContextProps } from '../features/accounts/types';

export default function Index() {
	const [appLoggedIn, setAppLoggedIn] = useState(false);
	const [twitterLoggedIn, setTwitterLoggedIn] = useState(false);

	const { account } = useContext(AccountContext) as AccountContextProps;

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

	if (!twitterLoggedIn && account.id > 0) {
		setTwitterLoggedIn(true);
	}

	return (
		<>
			<Routes>
				<Route path="sign-up" element={<SignUp />} />
				<Route path="login" element={<Login appLogin={setAppLoggedIn} />} />
				<Route path="select-account" element={<SelectAccount />} />
				<Route path="twitter-oauth-callback" element={<LoginSuccess />} />
				<Route path="/" element={appLoggedIn && twitterLoggedIn ? <Dashboard /> : <Navigate to="login" />} />
				{/*<Route path="*" element={<PageNotFound />} />*/}
			</Routes>
		</>
	);
}
