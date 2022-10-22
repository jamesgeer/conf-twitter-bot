import { Account, AccountContextProps, TwitterUser } from '../../features/accounts/types';
import {
	Avatar,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Icon,
	Center,
	Flex,
	MenuDivider,
} from '@chakra-ui/react';
import { IconSwitchHorizontal, IconLogout, IconChevronDown } from '@tabler/icons';
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { useAccounts } from '../../features/accounts/api/getAccounts';
import { AccountContext } from '../../features/accounts/context/AccountContext';

interface Props {
	twitterUser: TwitterUser;
	handleLogout: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const UserCard = ({ twitterUser, handleLogout }: Props) => {
	const { handleAccountChange } = useContext(AccountContext) as AccountContextProps;
	const { isLoading, error, data: accounts } = useAccounts();

	// displays "loading accounts" while the accounts are being fetched
	if (isLoading) {
		return <div>Loading Accounts...</div>;
	}

	// if there is an error then will display an error message
	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	const handleAccountSelection = (accountId: number) => {
		const account = accounts.find((account) => account.id === accountId);
		if (account) {
			handleAccountChange(account);
		}
	};

	const displayAccounts = accounts.map((account: Account) => {
		return (
			<MenuItem onClick={() => handleAccountSelection(account.id)} key={account.id}>
				<Avatar
					src={account.twitterUser.profileImageUrl} //use the profile picture of the twitter account
					mr="12px"
					size="sm" // small picture
				/>
				{account.twitterUser.name}
			</MenuItem>
		);
	});

	return (
		<Menu>
			{/* menu button displays the current "active" account */}
			<MenuButton as={Button} size="md" rightIcon={<IconChevronDown />}>
				<Flex>
					<Center>
						<Avatar src={twitterUser.profileImageUrl} mr="8px" size="sm" />
						{twitterUser.name}
					</Center>
				</Flex>
			</MenuButton>

			{/* list shows options such as other accounts, switch, logout, etc */}
			<MenuList>
				{displayAccounts}
				<MenuDivider />
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
