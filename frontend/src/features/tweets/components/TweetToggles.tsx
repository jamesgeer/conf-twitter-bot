import { IconCheck } from '@tabler/icons';
import { Flex, Button } from '@chakra-ui/react';
import { useState } from 'react';

const TweetToggles = () => {
	const [toggles, setToggles] = useState({
		all: true,
		sent: false,
		unsent: false,
	});

	return (
		<Flex gap={6} paddingBottom={4}>
			{toggles.all ? (
				<Button height={9} borderRadius={20} border="2px" borderColor="blue.400" leftIcon={<IconCheck />}>
					All
				</Button>
			) : (
				<Button
					height={9}
					borderRadius={20}
					onClick={() => {
						setToggles({ all: true, sent: false, unsent: false });
					}}
				>
					All
				</Button>
			)}

			{toggles.sent ? (
				<Button height={9} borderRadius={20} border="2px" borderColor="blue.400" leftIcon={<IconCheck />}>
					Sent
				</Button>
			) : (
				<Button
					height={9}
					borderRadius={20}
					onClick={() => {
						setToggles({ all: false, sent: true, unsent: false });
					}}
				>
					Sent
				</Button>
			)}

			{toggles.unsent ? (
				<Button height={9} borderRadius={20} border="2px" borderColor="blue.400" leftIcon={<IconCheck />}>
					Unsent
				</Button>
			) : (
				<Button
					height={9}
					borderRadius={20}
					onClick={() => {
						setToggles({ all: false, sent: false, unsent: true });
					}}
				>
					Unsent
				</Button>
			)}
		</Flex>
	);
};

export default TweetToggles;
