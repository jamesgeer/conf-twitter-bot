import UserCard from '../ui/UserCard';
import { useContext } from 'react';
import { AccountContext } from '../../context/AccountContext';
import { ActiveTwitterAccountContext } from '../../types';
import Button from '../ui/Button';

const Header = () => {
	const { activeAccount } = useContext(AccountContext) as ActiveTwitterAccountContext;

	return (
		<header className="bg-slate-100 mb-5">
			<nav className="navbar container mx-auto py-4 flex justify-between items-center">
				<h2 className="text-xl font-bold">ConfTwBot</h2>
				{activeAccount.userId.length > 0 && <UserCard activeAccount={activeAccount} />}
				{activeAccount.userId.length === 0 && <Button text={'Sign In'} />}
			</nav>
		</header>
	);
};

export default Header;
