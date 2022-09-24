import { useEffect } from 'react';

const LoginSuccess = () => {
	useEffect(() => {
		setTimeout(() => {
			window.close();
		}, 5000);
	});

	return (
		<div>
			<p>Please wait a moment...</p>
		</div>
	);
};

export default LoginSuccess;
