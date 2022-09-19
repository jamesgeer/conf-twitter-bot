import React, { createContext, useState } from 'react';
import { AccountContextProps, Account } from '../types';
import axios from 'axios';
import HttpStatus from 'http-status';

// stops type error on the 'children' variable within the provider
interface Props {
	children: React.ReactNode;
}

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

// context will be null until an account has been set
export const AccountContext = createContext<AccountContextProps | null>(null);

export const AccountProvider: React.FC<Props> = ({ children }) => {
	const [account, setAccount] = useState<Account>(initialAccountState);

	const handleAccountChange = async (account: Account) => {
		const {
			id: accountId,
			twitterUser: { id: twitterUserId },
		} = account;
		if (accountId === 0) {
			return;
		}
		try {
			const payload = { accountId, twitterUserId };

			const response = await axios.post('/api/sessions/account', payload);
			if (response.status === HttpStatus.OK) {
				setAccount(account);
				console.log(`account: ${accountId} twitterUserId: ${twitterUserId} now active`);
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// @ts-ignore
				console.error(error.response.data.message);
			}
		}
	};

	return <AccountContext.Provider value={{ account, handleAccountChange }}>{children}</AccountContext.Provider>;
};
