import { useContext } from 'react';
import { ActiveAccountContext } from '../../context/ActiveAccountContext';
import { ActiveTwitterAccountContext } from '../../types/twitter-types';

const UserCard = () => {
	const { activeAccount } = useContext(ActiveAccountContext) as ActiveTwitterAccountContext;

	return (
		<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full">
			<img className="mr-2 w-8 h-8 rounded-full" src={activeAccount.profileImageUrl} alt="user" />
			{activeAccount.name}
		</button>
	);
};

export default UserCard;
