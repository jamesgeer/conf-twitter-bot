import { useEffect, useRef } from 'react';
import { getOAuthRequestToken } from '../api/getRequestToken';

const LoginWindow = () => {
	const windowOpen = useRef(false);

	useEffect(() => {
		if (!windowOpen.current) {
			newWindow().then();
		}

		// useRef to prevent window from opening twice in development mode
		windowOpen.current = true;
	}, []);

	const windowFeatures = (parentWindow: Window, w: number, h: number): string => {
		const y = parentWindow.top!.outerHeight / 2 + parentWindow.top!.screenY - h / 2;
		const x = parentWindow.top!.outerWidth / 2 + parentWindow.top!.screenX - w / 2;
		return `toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`;
	};

	const twitterLoginUrl = async (): Promise<string> => {
		const oAuthToken = await getOAuthRequestToken();
		return `https://api.twitter.com/oauth/authenticate?oauth_token=${oAuthToken}`;
	};

	const newWindow = async () => {
		const features = windowFeatures(window, 500, 250);
		const url = await twitterLoginUrl();
		window.open(url, '', features);
	};

	return null;
};

export default LoginWindow;
