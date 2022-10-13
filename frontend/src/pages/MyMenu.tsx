import { IconDotsVertical, IconAlertTriangle } from '@tabler/icons';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import axios from 'axios';

interface Props {
	isActive: boolean;
	handleButtonClick: (e: any, a: number) => void;
	accountId: number;
}

const MyMenu = ({ isActive, handleButtonClick, accountId }: Props) => {
	const handleDelete = async (e: any) => {
		e.preventDefault();
		try {
			await axios.delete('/api/accounts/' + accountId);
		} catch (error) {
			console.log(error);
		}
	};

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
						onClick={(e) => handleDelete(e)}
					>
						Delete Account
					</MenuItem>
				</MenuList>
			)}
		</Menu>
	);
};

export default MyMenu;
