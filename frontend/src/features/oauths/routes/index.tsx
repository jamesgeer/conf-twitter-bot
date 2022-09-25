import { Route, Routes } from 'react-router-dom';
import LoginSuccess from '../components/LoginSuccess';

export const OAuthRoutes = () => {
	return (
		<Routes>
			<Route path="twitter-oauth-callback" element={<LoginSuccess />} />
		</Routes>
	);
};
