import React, { useState } from 'react';

const Login = () => {
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
			setValidationError(true);
			setErrorText('Please enter a password.');
		}
	};

	return (
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
					<p className={`text-red-500 text-xs italic ${validationError ? 'block' : 'hidden'}`}>{errorText}</p>
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
	);
};

export default Login;
