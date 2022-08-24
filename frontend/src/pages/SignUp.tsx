import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [usrValidationError, setUsrValidationError] = useState(false);
	const [usrErrorText, setUsrErrorText] = useState('');
	const [pwdValidationError, setPwdValidationError] = useState(false);
	const [pwdErrorText, setPwdErrorText] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.id === 'username') {
			setUsername(e.target.value);

			// reset validation errors when password input is modified
			if (usrValidationError) {
				setUsrValidationError(false);
			}
		} else {
			setPassword(e.target.value);

			// reset validation errors when password input is modified
			if (pwdValidationError) {
				setPwdValidationError(false);
			}
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

		let error = false;
		// check username length on submission
		if (username.length === 0) {
			usrFormError('Please enter a username.');
			error = true;
		}

		// check password length on submission
		if (password.length === 0) {
			pwdFormError('Please enter a password.');
			error = true;
		}

		if (password.length > 0 && password.length < 7) {
			pwdFormError('Password must have at least 7 characters.');
			error = true;
		}

		if (error) {
			return;
		}
	};

	const usrFormError = (errorMessage: string): void => {
		setUsrValidationError(true);
		setUsrErrorText(errorMessage);
	};

	const pwdFormError = (errorMessage: string): void => {
		setPwdValidationError(true);
		setPwdErrorText(errorMessage);
	};

	return (
		<div className="container mx-auto flex justify-center">
			<div className="w-full max-w-sm">
				<form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded">
					<h2 className="font-medium text-3xl text-center pb-5">Sign Up</h2>
					<div className="mb-6 grid grid-cols-1 gap-4">
						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
								Username
							</label>
							<input
								className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline ${
									usrValidationError ? 'border-red-500' : ''
								}`}
								id="username"
								type="text"
								placeholder="Username"
								value={username}
								onChange={(e) => handleChange(e)}
								onKeyDown={(e) => handleKeyDown(e)}
							/>
							<p className={`text-red-500 text-xs italic ${usrValidationError ? 'block' : 'hidden'}`}>
								{usrErrorText}
							</p>
						</div>
						<div>
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
								Password
							</label>
							<input
								className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline ${
									pwdValidationError ? 'border-red-500' : ''
								}`}
								id="password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => handleChange(e)}
								onKeyDown={(e) => handleKeyDown(e)}
							/>
							<p className={`text-red-500 text-xs italic ${pwdValidationError ? 'block' : 'hidden'}`}>
								{pwdErrorText}
							</p>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<Link to="/" className="text-sm text-blue-500">
							Already have an account?
						</Link>
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-[8rem] h-[1.25rem] text-sm flex items-center justify-center"
							onClick={(e) => handleSubmission(e)}
						>
							Sign Up
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
