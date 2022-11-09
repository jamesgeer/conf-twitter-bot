import React, { useState } from 'react';
import axios from 'axios';
import HttpStatus from 'http-status';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUserSession } from '../features/sessions/api/createUserSession';

interface Props {
	appLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = ({ appLogin }: Props) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [validationError, setValidationError] = useState(false);
	const [errorText, setErrorText] = useState('');
	const mutation = useCreateUserSession();
	const navigate = useNavigate();

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);

		// reset validation errors when password input is modified
		if (validationError) {
			setValidationError(false);
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			const userLogin = { username, password };
			await mutation.mutateAsync(userLogin).then(() => {
				appLogin(true);
				navigate('/select-account');
			});
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.response?.status === HttpStatus.UNAUTHORIZED) {
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
				<form className="bg-white dark:bg-transparent dark:border shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<div className="mb-6">
						<label
							className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-slate-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
								validationError ? 'border-red-500' : ''
							}`}
							id="username"
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => handleUsernameChange(e)}
							onKeyDown={(e) => handleKeyDown(e)}
						/>
						<p className={`text-red-500 text-xs italic ${validationError ? 'block' : 'hidden'}`}>
							{errorText}
						</p>
					</div>
					<div className="mb-6">
						<label
							className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-slate-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
								validationError ? 'border-red-500' : ''
							}`}
							id="password"
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => handlePasswordChange(e)}
							onKeyDown={(e) => handleKeyDown(e)}
						/>
						<p className={`text-red-500 text-xs italic ${validationError ? 'block' : 'hidden'}`}>
							{errorText}
						</p>
					</div>
					<div className="flex flex-col gap-5 items-center">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
							onClick={(e) => handleSubmission(e)}
						>
							Sign In
						</button>
						<Link to="/sign-up" className="text-sm text-blue-500">
							Don't have an account yet?
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
