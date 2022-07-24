import UserCard from './UserCard';
import { useContext } from 'react';
import { ActiveAccountContext } from '../../context/ActiveAccountContext';
import { ActiveTwitterAccountContext } from '../../types/twitter-types';
import LoginButton from '../buttons/LoginButton';

const Header = () => {
	const { activeAccount } = useContext(ActiveAccountContext) as ActiveTwitterAccountContext;

	return (
		<header className="bg-slate-100 mb-5">
			<nav className="navbar container mx-auto py-4 flex justify-between items-center">
				<h2>ConfTwBot</h2>
				{activeAccount.userId.length > 0 && <UserCard activeAccount={activeAccount} />}
				{activeAccount.userId.length === 0 && <LoginButton />}
			</nav>
		</header>
	);
};

export default Header;
