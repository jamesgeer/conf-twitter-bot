import { TwitterAccount } from '../../types';

interface Props {
	activeAccount: TwitterAccount;
}

const UserCard = ({ activeAccount }: Props) => {
	return (
		<button className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
			<img className="mr-2 w-8 h-8 rounded-full" src={activeAccount.profileImageUrl} alt="user" />
			{activeAccount.name}
		</button>
	);
};

export default UserCard;
