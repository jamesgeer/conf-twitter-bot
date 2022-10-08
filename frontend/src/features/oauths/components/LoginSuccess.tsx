import { useEffect, useRef } from 'react';
import queryString from 'query-string';
import { createAccessToken } from '../api/createAccessToken';
import { AccessToken } from '../types';
import { TwitterUser } from '../../accounts/types';
import { useCreateAccount } from '../../accounts/api/createAccount';

const LoginSuccess = () => {
	const queryRan = useRef(false);
	const createAccountMutation = useCreateAccount();

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
		if (!token || !verifier) {
			// display this on the page
			console.log('Missing access token');
			return null;
		}

		// @ts-ignore typescript does not want to believe that this is a string
		const accessToken: AccessToken = { token, verifier };

		const result = await createAccessToken(accessToken);
		console.log(result);
		return result;
	};

	return (
		<div>
			<p>Please wait a moment...</p>
		</div>
	);
};

// export default LoginSuccess;
//
// import queryString from 'query-string';
// import { AccessToken } from '../types';
// import { useCreateAccount } from '../../accounts/api/createAccount';
//
// const LoginSuccess = () => {
// 	const { mutate: createAccount } = useCreateAccount();
//
// 	createAccount();
//
// 	const { oauth_token: token, oauth_verifier: verifier } = queryString.parse(window.location.search);
// 	// @ts-ignore
// 	const accessToken: AccessToken = { token, verifier };
//
// 	try {
// 		createAccount(accessToken);
// 		await createAccountMutation.mutateAsync(accessToken).then(() => window.close());
// 	} catch (e) {
// 		console.log(e);
// 		console.log(createAccountMutation.error);
// 	}
//
// 	return (
// 		<div>
// 			<p>Please wait a moment...</p>
// 		</div>
// 	);
// };
//
export default LoginSuccess;
