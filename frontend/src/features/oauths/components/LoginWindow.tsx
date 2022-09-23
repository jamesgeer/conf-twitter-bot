import { useEffect, useRef, useState } from 'react';
import { getOAuthRequestToken } from '../api/getRequestToken';

const LoginWindow = () => {
	const [loginWindow, setLoginWindow] = useState(null);
	const windowOpen = useRef(false);

	useEffect(() => {
		const newWindow = async () => {
			const features = windowFeatures(window, 500, 250);
			const url = await twitterLoginUrl();
			const handleWindow = window.open(url, '', features);

			if (handleWindow) {
				console.log(handleWindow.closed);
				// @ts-ignore
				setLoginWindow(handleWindow);
				windowOpen.current = true;
			}
		};

		// useRef to prevent window from opening twice in development mode
		if (!windowOpen.current) {
			newWindow().then();
		}

		// @ts-ignore
		if (loginWindow && loginWindow.closed) {
			console.log('window was closed');
			setLoginWindow(null);
			windowOpen.current = false;
		}
	}, [loginWindow]);

	const windowFeatures = (parentWindow: Window, w: number, h: number): string => {
		// @ts-ignore
		const y = parentWindow.top.outerHeight / 2 + parentWindow.top.screenY - h / 2;
		// @ts-ignore
		const x = parentWindow.top.outerWidth / 2 + parentWindow.top.screenX - w / 2;
		return `toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`;
	};

	const twitterLoginUrl = async (): Promise<string> => {
		const oAuthToken = await getOAuthRequestToken();
		return `https://api.twitter.com/oauth/authenticate?oauth_token=${oAuthToken}`;
	};

	// const createNewLoginWindow = async (): Promise<Window | null> => {
	// 	const features = windowFeatures(window, 500, 250);
	// 	const url = await twitterLoginUrl();
	//
	// 	return window.open(url, '', features);
	// };

	// @ts-ignore

	return null;
};

export default LoginWindow;
