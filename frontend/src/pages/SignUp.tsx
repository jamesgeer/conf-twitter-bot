import React, { useState } from 'react';

const SignUp = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	// submit form if user hits the enter key on their keyboard
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmission(e);
		}
	};

	// submission from input itself or from button
	const handleSubmission = (e: React.FormEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		console.log("Username is: " + username + " and password is: " + password);
	};


	return (
		<div className="container mx-auto flex justify-center">
			<div className="w-full max-w-sm">
			<form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded">
			<h2 className="font-medium text-3xl text-center pb-5">
				Sign Up
			</h2>
			<div className="mb-6">
			<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
					Username
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					id="username"
					type="text" 
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
					Password
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					id="password"
					type="password" 
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<div className="flex items-center justify-between">
				<a className="text-sm text-blue-500" href="/">Already have an account?</a>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[8rem] h-[1.25rem] text-sm flex items-center justify-center"
					type="button"
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
