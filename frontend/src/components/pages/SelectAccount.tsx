import axios from 'axios';
import { useEffect, useState } from 'react';
import { TwitterAccount, TwitterAccounts } from '../../types/twitter-types';

const SelectAccount = () => {
	const [twitterAccounts, setTwitterAccounts] = useState<TwitterAccounts>([]);
	//const [activeAccount, setActiveAccount] = useState({});

	useEffect(() => {
		if (twitterAccounts.length === 0) {
			getAccounts().then();
		}
	}, [twitterAccounts]);

	const getAccounts = async () => {
		try {
			const response = await axios.get('/api/twitter/accounts');
			const twitterAccounts: TwitterAccounts = response.data;
			setTwitterAccounts(twitterAccounts);
		} catch (error) {
			console.error(error);
		}
	};

	const accounts = twitterAccounts.map((account: TwitterAccount) => {
		return <li key={account.userId}>{account.screenName}</li>;
	});

	return (
		<div>
			<h1>Select an Account</h1>
			<ul>{accounts}</ul>
		</div>
	);
};

export default SelectAccount;
