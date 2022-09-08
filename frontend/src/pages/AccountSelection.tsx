import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ActiveTwitterAccountContext, TwitterAccount, TwitterAccounts } from '../types';
import { ActiveAccountContext } from '../context/ActiveAccountContext';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const AccountSelection = () => {
	const [twitterAccounts, setTwitterAccounts] = useState<TwitterAccounts>([]);
	const { setActiveUser } = useContext(ActiveAccountContext) as ActiveTwitterAccountContext;
	const navigate = useNavigate();

	useEffect(() => {
		if (twitterAccounts.length === 0) {
			getAccounts().then();
		}
	}, [twitterAccounts]);

	const getAccounts = async () => {
		try {
			const response = await axios.get('/api/accounts');
			const twitterAccounts: TwitterAccounts = response.data;
			setTwitterAccounts(twitterAccounts);
		} catch (error) {
			console.error(error);
		}
	};

	const handleAccountSelection = (userId: string) => {
		// extract matching account from array of accounts with the selected userId
		const account = twitterAccounts.find((account) => account.userId === userId);
		if (account) {
			setActiveUser(account);

			// since context state isn't immediately updated we need to wait, otherwise
			// the user will just be sent back to the login screen since the state won't be set
			setTimeout(() => {
				navigate('/');
			}, 100);
		}
	};

	const accounts = twitterAccounts.map((account: TwitterAccount) => {
		return (
			<li
				className="flex items-center rounded-full py-3 px-4 bg-slate-100 cursor-pointer hover:bg-red-100"
				onClick={() => handleAccountSelection(account.userId)}
				key={account.userId}
			>
				<img className="rounded-full border-2 border-white" src={account.profileImageUrl} alt="Profile icon" />
				<p className="pl-3 text-2xl">{account.name}</p>
			</li>
		);
	});

	return (
		<div className="container mx-auto flex justify-center">
			<div className="mt-8 w-full xl:w-2/5">
				<h1 className="text-center text-4xl font-bold">Select an Account</h1>
				<ul className="mt-6 grid gap-y-6">{accounts}</ul>
				<div className="mt-6 flex justify-end">
					<Button text={'+ Add Account'} />
				</div>
			</div>
		</div>
	);
};

export default AccountSelection;
