import { useEffect } from 'react';

const LoginWindow = () => {
	useEffect(() => {
		const windowFeatures = 'left=100,top=100,width=320,height=320';
		const handle = window.open('https://www.mozilla.org/', '', windowFeatures);
		setTimeout(() => {
			if (handle) handle.close();
		}, 5000);
	});
};

export default LoginWindow;
