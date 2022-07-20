import React, { createContext, useState } from 'react';
import { ActiveTwitterAccountContext, TwitterAccount } from '../types/twitter-types';

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

	return (
		<ActiveAccountContext.Provider value={{ activeAccount, setActiveAccount }}>
			{children}
		</ActiveAccountContext.Provider>
	);
};

export { ActiveAccountContext, ActiveAccountProvider };
