import UserCard from '../ui/UserCard';
import React, { useContext } from 'react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { AccountContextProps } from '../../features/accounts/types';
import { AccountContext } from '../../features/accounts/context/AccountContext';
import DarkModeButton from '../ui/DarkModeButton';
import { useUseSession } from '../../features/sessions/api/getUserSession';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const Header = () => {
	const { account } = useContext(AccountContext) as AccountContextProps;
	const userSession = useUseSession();
	const queryClient = useQueryClient();

	const navigate = useNavigate();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		navigate('/login');
	};

	const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		try {
			await axios.post('/api/sessions/logout').then(() => {
				account.twitterUser.id = BigInt(0);
				queryClient.removeQueries();
				queryClient.clear();
				navigate('/login');
			});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<header className="mb-5">
			<nav className="navbar container mx-auto py-4 flex justify-between items-center">
				<h2 className="text-xl font-bold">ConfTwBot</h2>
				<div className="flex items-center gap-3">
					<DarkModeButton />
					{account.twitterUser.id > 0 ? (
						<UserCard twitterUser={account.twitterUser} handleLogout={handleLogout} />
					) : userSession.data > 0 ? (
						<Button text={'Logout'} onClick={(e) => handleLogout(e)} />
					) : (
						<Button text={'Sign In'} onClick={(e) => handleClick(e)} />
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
