import React, { createContext, useState } from 'react';
import { AccountContextProps, Account } from '../types';
import axios from 'axios';
import HttpStatus from 'http-status';
import { useUpdateAccountSession } from '../../sessions/api/updateAccountSession';

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
	const mutation = useUpdateAccountSession();

	const handleAccountChange = async (account: Account) => {
		try {
			await mutation.mutateAsync(account).then(() => setAccount(account));
		} catch (e) {
			console.log(e);
		}
	};

	return <AccountContext.Provider value={{ account, handleAccountChange }}>{children}</AccountContext.Provider>;
};
