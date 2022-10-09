import { TwitterUser } from '../../features/accounts/types';
import { Avatar, Button, Menu, MenuButton, MenuList, MenuItem, Icon, Center, Flex } from '@chakra-ui/react';
import { IconSwitchHorizontal, IconLogout, IconChevronDown } from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

interface Props {
	twitterUser: TwitterUser;
	handleLogout: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const UserCard = ({ twitterUser, handleLogout }: Props) => {
	return (
		<Menu>
			<MenuButton as={Button} size="md" rightIcon={<IconChevronDown />}>
				<Flex>
					<Center>
						<Avatar src={twitterUser.profileImageUrl} mr="8px" size="sm" />
						{twitterUser.name}
					</Center>
				</Flex>
			</MenuButton>

			<MenuList>
				<MenuItem as={Link} to={'select-account'}>
					<Icon as={IconSwitchHorizontal} mr="8px" />
					Switch Account
				</MenuItem>
				<MenuItem onClick={(e) => handleLogout(e)}>
					<Icon as={IconLogout} mr="8px" />
					Logout
				</MenuItem>
			</MenuList>
		</Menu>
	);
};

export default UserCard;
