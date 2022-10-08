import { useEffect, useRef } from 'react';
import queryString from 'query-string';
import { createAccessToken } from '../api/createAccessToken';
import { AccessToken } from '../types';
import { TwitterUser } from '../../accounts/types';
import { useCreateAccount } from '../../accounts/api/createAccount';

const LoginSuccess = () => {
	const queryRan = useRef(false);
	const mutation = useCreateAccount();

	useEffect(() => {
		if (!queryRan.current) {
			processAccessToken().then(() => {
				window.close();
			});
		}

		queryRan.current = true;
	});

	const processAccessToken = async (): Promise<TwitterUser | null> => {
		const { oauth_token: token, oauth_verifier: verifier } = queryString.parse(window.location.search);
		if (token && verifier) {
			// @ts-ignore typescript does not want to believe that this is a string
			const accessToken: AccessToken = { token, verifier };

			const result = await createAccessToken(accessToken);
			console.log(result);
			return result;
		}
		console.log('missing token');
		return null;
	};

	return (
		<div>
			<p>Please wait a moment...</p>
		</div>
	);
};

export default LoginSuccess;
