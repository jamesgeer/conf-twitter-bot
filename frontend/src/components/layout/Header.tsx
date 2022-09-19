import UserCard from '../ui/UserCard';
import { useContext } from 'react';
import { AccountContext } from '../../context/AccountContext';
import { AccountContextProps } from '../../types';
import Button from '../ui/Button';

const Header = () => {
	const { account } = useContext(AccountContext) as AccountContextProps;

	return (
		<header className="bg-slate-100 mb-5">
			<nav className="navbar container mx-auto py-4 flex justify-between items-center">
				<h2 className="text-xl font-bold">ConfTwBot</h2>
				{account.twitterUser.id > 0 ? (
					<UserCard twitterUser={account.twitterUser} />
				) : (
					<Button text={'Sign In'} />
				)}
			</nav>
		</header>
	);
};

export default Header;
