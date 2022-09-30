import UserCard from '../ui/UserCard';
import React, { useContext } from 'react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { AccountContextProps } from '../../features/accounts/types';
import { AccountContext } from '../../features/accounts/context/AccountContext';

const Header = () => {
	const { account } = useContext(AccountContext) as AccountContextProps;
	const navigate = useNavigate();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		navigate('/login');
	};

	return (
		<header className="mb-5">
			<nav className="navbar container mx-auto py-4 flex justify-between items-center">
				<h2 className="text-xl font-bold">ConfTwBot</h2>
				{account.twitterUser.id > 0 ? (
					<UserCard twitterUser={account.twitterUser} />
				) : (
					<Button text={'Sign In'} onClick={(e) => handleClick(e)} />
				)}
			</nav>
		</header>
	);
};

export default Header;
