import { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';
import { AccessToken } from '../types';
import { useCreateAccount } from '../../accounts/api/createAccount';

const LoginSuccess = () => {
	const [accessToken, setAccessToken] = useState<AccessToken>();

	// useRef to prevent multiple re-renders otherwise useEffect and React Query chain re-renders
	// crashing the page
	const queryRan = useRef(false);

	const createAccountMutation = useCreateAccount();

	useEffect(() => {
		if (!queryRan.current) {
			const { oauth_token: token, oauth_verifier: verifier } = queryString.parse(window.location.search);

			if (token && verifier) {
				// @ts-ignore typescript does not want to believe that this is a string
				const accessToken: AccessToken = { token, verifier };

				setAccessToken(accessToken);
			}
		}
	}, []);

	if (accessToken && !queryRan.current) {
		queryRan.current = true;
		createAccountMutation
			.mutateAsync(accessToken)
			.then(() => window.close())
			.catch((e) => {
				console.log(e);
			});
	}

	return (
		<div>
			{createAccountMutation.isError && <div>An error occurred</div>}
			{!createAccountMutation.isError && <div>Please wait a moment...</div>}
		</div>
	);
};

export default LoginSuccess;
