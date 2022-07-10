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

	return (
		<div className="container mx-auto flex justify-center">
			<Router>
				<Routes>
					{appLoggedIn && <Route path="/" element={<TwitterLogin />} />}
					{twitterLoggedIn && <Route path="/" element={<Index />} />}
					{!appLoggedIn && !twitterLoggedIn && (
						<Route path="/" element={<Login appLogin={setAppLoggedIn} />} />
					)}
				</Routes>
			</Router>
		</div>
	);
}
