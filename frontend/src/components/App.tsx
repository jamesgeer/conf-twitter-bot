import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Index from './pages/Index';
import Login from './pages/Login';
import TwitterLogin from './pages/TwitterLogin';

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/login" element={<Login />} />
				<Route path="/twitter-login" element={<TwitterLogin />} />
			</Routes>
		</Router>
	);
}
