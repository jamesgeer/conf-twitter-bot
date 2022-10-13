import { IconDotsVertical, IconAlertTriangle } from '@tabler/icons';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';

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
				bg="none"
				_hover={{ bg: 'none' }}
				_active={{ bg: 'none' }}
			></MenuButton>
			{isActive && (
				<MenuList onClick={(e) => e.stopPropagation()}>
					<MenuItem
						color="red.500"
						bg="white"
						_hover={{ bg: 'red.100' }}
						icon={<IconAlertTriangle />}
						onClick={() => console.log('Delete account ' + accountId)}
					>
						Delete Account
					</MenuItem>
				</MenuList>
			)}
		</Menu>
	);
};

export default MyMenu;
