import { IconDotsVertical } from '@tabler/icons';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { Account } from '../features/accounts/types';

interface Props {
	isActive: boolean;
	handleButtonClick: (e: any, a: number) => void;
	accountId: number;
}

const MyMenu = ({ isActive, handleButtonClick, accountId }: Props) => {
	return (
		<Menu>
			<MenuButton
				onClick={(e) => handleButtonClick(e, accountId)}
				as={Button}
				rightIcon={<IconDotsVertical />}
			></MenuButton>
			{isActive && (
				<MenuList onClick={(e) => e.stopPropagation()}>
					<MenuItem onClick={() => console.log('Delete account ' + accountId)}>Delete Account</MenuItem>
				</MenuList>
			)}
		</Menu>
	);
};

export default MyMenu;
