import React, { createContext, useState } from 'react';
import { ActiveTwitterAccountContext, Account } from '../types';
import axios from 'axios';
import HttpStatus from 'http-status';

// stops type error on the 'children' variable within the provider
interface Props {
	children: React.ReactNode;
}

// context will be null until an active account has been set
const ActiveAccountContext = createContext<ActiveTwitterAccountContext | null>(null);

// typescript requires an initial state for an active account to be set and updated
const initialAccountState = {
	id: 0,
	userId: 0,
	twitterUser: {
		id: BigInt(0),
		name: '',
		screenName: '',
		profileImageUrl: '',
	},
};

const ActiveAccountProvider: React.FC<Props> = ({ children }) => {
	const [activeAccount, setActiveAccount] = useState<Account>(initialAccountState);

	const setActiveUser = async (account: Account) => {
		const { userId } = account;
		if (userId === 0) {
			return;
		}
		try {
			const payload = { userId };
			const response = await axios.post('/api/sessions/account', payload);
			if (response.status === HttpStatus.OK) {
				setActiveAccount(account);
				console.log(`${userId} now active`);
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// @ts-ignore
				console.error(error.response.data.message);
			}
		}
	};

	return (
		<ActiveAccountContext.Provider value={{ activeAccount, setActiveUser }}>
			{children}
		</ActiveAccountContext.Provider>
	);
};

export { ActiveAccountContext, ActiveAccountProvider };
