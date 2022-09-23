import { useEffect, useState } from 'react';

const LoginWindow = () => {
	const [loginWindow, setLoginWindow] = useState(null);

	useEffect(() => {
		const windowFeatures = 'left=100,top=100,width=320,height=320';
		const handle = window.open('https://www.mozilla.org/', '', windowFeatures);
		if (handle) {
			// @ts-ignore
			setLoginWindow(handle);
		}

		setTimeout(() => {
			if (handle) handle.close();
		}, 5000);
	}, []);

	return <>{loginWindow}</>;
};

export default LoginWindow;
