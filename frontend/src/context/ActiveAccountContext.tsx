import React, { createContext, useState } from 'react';
import { ActiveTwitterAccountContext, TwitterAccount, TwitterAccounts } from '../types';
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
	userId: '',
	name: '',
	screenName: '',
	profileImageUrl: '',
};

const ActiveAccountProvider: React.FC<Props> = ({ children }) => {
	const [activeAccount, setActiveAccount] = useState<TwitterAccount>(initialAccountState);

	const setActiveUser = async (twitterAccount: TwitterAccount) => {
		const { userId } = twitterAccount;
		if (userId.length === 0) {
			return;
		}
		try {
			const response = await axios.post(`/api/session/twitter/user/${userId}`);
			if (response.status === HttpStatus.OK) {
				setActiveAccount(twitterAccount);
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
