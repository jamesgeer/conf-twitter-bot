import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AccountContextProps, Account, Accounts } from '../types';
import { AccountContext } from '../context/AccountContext';
import { useNavigate } from 'react-router-dom';
import { getOAuthRequestToken } from '../features/oauths/api/getRequestToken';
import LoginWindow from '../features/oauths/components/LoginWindow';

const AccountSelection = () => {
	const [accounts, setAccounts] = useState<Accounts>([]);
	const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false);
	const { handleAccountChange } = useContext(AccountContext) as AccountContextProps;
	const navigate = useNavigate();

	useEffect(() => {
		getAccounts().then();
	}, []);

	const getAccounts = async () => {
		try {
			const response = await axios.get('/api/accounts');
			setAccounts(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleAccountSelection = (accountId: number) => {
		// extract matching account from array of accounts with the selected userId
		const account = accounts.find((account) => account.id === accountId);
		if (account) {
			handleAccountChange(account);

			// since context state isn't immediately updated we need to wait, otherwise
			// the user will just be sent back to the login screen since the state won't be set
			setTimeout(() => {
				navigate('/');
			}, 100);
		}
	};

	const displayAccounts = accounts.map((account: Account) => {
		return (
			<li
				className="flex items-center rounded-full py-3 px-4 bg-slate-100 cursor-pointer hover:bg-red-100"
				onClick={() => handleAccountSelection(account.id)}
				key={account.id}
			>
				<img
					className="rounded-full border-2 border-white"
					src={account.twitterUser.profileImageUrl}
					alt="Profile icon"
				/>
				<p className="pl-3 text-2xl">{account.twitterUser.name}</p>
			</li>
		);
	});

	const handleAddAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		setIsLoginWindowOpen(true);
		//
		// const oAuthToken = await getOAuthRequestToken();
		// const twitterLoginUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oAuthToken}`;
		// const windowFeatures = 'left=100,top=100,width=320,height=320';
		// const handle = window.open(twitterLoginUrl, '', windowFeatures);
		// setTimeout(() => {
		// 	if (handle) handle.stop();
		// }, 1000);
	};

	return (
		<div className="container mx-auto flex justify-center">
			<div className="mt-8 w-full xl:w-2/5">
				<h1 className="text-center text-4xl font-bold">Select an Account</h1>
				{accounts.length > 0 ? (
					<ul className="mt-6 grid gap-y-6">{displayAccounts}</ul>
				) : (
					<p className="text-center mt-6">Click on "Add Account" to link your first Twitter account.</p>
				)}
				<div className="mt-6 flex justify-center">
					{/*<Button text={'+ Add Account'} />*/}
					<button onClick={(e) => handleAddAccount(e)}>Add Account</button>
				</div>
				{isLoginWindowOpen && <LoginWindow />}
			</div>
		</div>
	);
};

export default AccountSelection;
