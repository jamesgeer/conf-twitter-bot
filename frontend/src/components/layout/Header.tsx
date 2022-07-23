import UserCard from './UserCard';

const Header = () => {
	return (
		<header className="bg-slate-100 mb-5">
			<nav className="navbar container mx-auto py-4 flex justify-between items-center">
				<h2>ConfTwBot</h2>
				<UserCard />
			</nav>
		</header>
	);
};

export default Header;
