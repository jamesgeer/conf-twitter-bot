import React, { useState } from 'react';
import axios from 'axios';
import HttpStatus from 'http-status';

interface Props {
	appLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = ({ appLogin }: Props) => {
	const [password, setPassword] = useState('');
	const [validationError, setValidationError] = useState(false);
	const [errorText, setErrorText] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);

		// reset validation errors when password input is modified
		if (validationError) {
			setValidationError(false);
		}
	};

	// submit form if user hits the enter key on their keyboard
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmission(e);
		}
	};

	// submission from input itself or from button
	const handleSubmission = (e: React.FormEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		// check submission length
		if (password.length === 0) {
			formError('Please enter a password.');
			return;
		}

		// send credentials to the server
		authenticateLogin().then();
	};

	const authenticateLogin = async (): Promise<void> => {
		try {
			const config = {
				withCredentials: true,
			};
			const payload = { password };
			const response = await axios.post('/api/session', payload, config);
			if (response.status === HttpStatus.OK) {
				appLogin(true);
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (err.response?.status === HttpStatus.UNAUTHORIZED) {
					formError('Invalid password.');
					return;
				}
			}
		}
		formError('Connection error... please wait and try again.');
	};

	const formError = (errorMessage: string): void => {
		setValidationError(true);
		setErrorText(errorMessage);
	};

	return (
		<div className="container mx-auto flex justify-center">
			<div className="w-full max-w-xs">
				<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<div className="mb-6">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
							Password
						</label>
						<input
							className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
								validationError ? 'border-red-500' : ''
							}`}
							id="password"
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => handleChange(e)}
							onKeyDown={(e) => handleKeyDown(e)}
						/>
						<p className={`text-red-500 text-xs italic ${validationError ? 'block' : 'hidden'}`}>
							{errorText}
						</p>
					</div>
					<div className="flex items-center justify-between">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
							type="button"
							onClick={(e) => handleSubmission(e)}
						>
							Sign In
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
