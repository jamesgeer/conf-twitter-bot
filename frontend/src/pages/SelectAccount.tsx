import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginWindow from '../features/oauths/components/LoginWindow';
import Button from '../components/ui/Button';
import { useAccounts } from '../features/accounts/api/getAccounts';
import { AccountContextProps, Account } from '../features/accounts/types';
import { AccountContext } from '../features/accounts/context/AccountContext';
import SelectAccountMenu from '../features/accounts/components/SelectAccountMenu';

const SelectAccount = () => {
	const { handleAccountChange } = useContext(AccountContext) as AccountContextProps;
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(0);

	const { isLoading, error, data: accounts } = useAccounts();

	if (isLoading) {
		return <div>Loading Accounts...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

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

	const handleButtonClick = (e: any, accountId: number) => {
		e.stopPropagation();
		setIsOpen(accountId);
	};

	const displayAccounts = accounts.map((account: Account) => {
		return (
			<li
				className="flex items-center justify-between rounded-full py-3 px-4 bg-slate-100 dark:bg-transparent dark:border dark:border-white dark:hover:bg-slate-700 cursor-pointer hover:bg-red-100"
				onClick={() => handleAccountSelection(account.id)}
				key={account.id}
			>
				<div className="flex items-center">
					<img
						className="rounded-full border-2 border-white"
						src={account.twitterUser.profileImageUrl}
						alt="Profile icon"
					/>
					<p className="pl-3 text-2xl">{account.twitterUser.name}</p>
				</div>
				<SelectAccountMenu
					isActive={isOpen === account.id}
					handleButtonClick={handleButtonClick}
					accountId={account.id}
				/>
			</li>
		);
	});

	const handleAddAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		new LoginWindow();
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
					<Button text={'+ Add Account'} onClick={(e) => handleAddAccount(e)} />
				</div>
			</div>
		</div>
	);
};

export default SelectAccount;
