import { TwitterUser } from '../../features/accounts/types';
import { Avatar, Button, Menu, MenuButton, MenuList, MenuItem, Icon } from '@chakra-ui/react';
import { IconSwitchHorizontal, IconLogout } from '@tabler/icons';

interface Props {
	twitterUser: TwitterUser;
}

const UserCard = ({ twitterUser }: Props) => {
	return (
		<Menu>
			<MenuButton as={Button} colorScheme="pink">
				<Avatar src={twitterUser.profileImageUrl} mr="8px" size="sm" />
				{twitterUser.name}
			</MenuButton>
			<MenuList>
				<MenuItem>
					<Icon as={IconSwitchHorizontal} />
					Switch Account
				</MenuItem>
				<MenuItem>
					<Icon as={IconLogout} />
					Logout
				</MenuItem>
			</MenuList>
		</Menu>
	);
};

export default UserCard;

// <button className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
// 	<Avatar src={twitterUser.profileImageUrl} mr="8px" size="sm" />
// 	{twitterUser.name}
// </button>
