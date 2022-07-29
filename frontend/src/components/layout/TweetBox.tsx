import { useContext, useState } from 'react';
import { ActiveAccountContext } from '../../context/ActiveAccountContext';
import { ActiveTwitterAccountContext } from '../../types/twitter-types';

const TweetBox = () => {
	const { activeAccount } = useContext(ActiveAccountContext) as ActiveTwitterAccountContext;
	const [content, setContent] = useState('');

	return (
		<div className="px-7 mt-2 text-black">
			<div className="flex gap-x-4 relative">
				<div>
					<img className="w-[48px] h-auto rounded-full" src={activeAccount.profileImageUrl} />
				</div>

				<div className="text-xl mt-2 w-full">
					<textarea
						className="w-full resize-none outline-none placeholder:text-sgray placeholder:text-opacity-75 overflow-hidden"
						placeholder="What's on your mind?"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					></textarea>
					<div className="flex items-center justify-between border-t-1 border-slate-100">
						<div className="flex items-center pt-1">
							<div className="hover:bg-primary hover:bg-opacity-20 rounded-full p-2 transition-all">
								<svg viewBox="0 0 24 24" aria-hidden="true" height={20} width={20}>
									<g>
										<path
											d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z"
											fill="#1d9bf0"
										></path>
										<circle cx="8.868" cy="8.309" r="1.542" fill="#1d9bf0"></circle>
									</g>
								</svg>
							</div>
							<div className="hover:bg-primary hover:bg-opacity-20 rounded-full p-2 transition-all">
								<svg viewBox="0 0 24 24" aria-hidden="true" height={20} width={20}>
									<g>
										<path d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2z" fill="#1d9bf0"></path>
										<path
											d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2zM18 2.2h-1.3v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H7.7v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H4.8c-1.4 0-2.5 1.1-2.5 2.5v13.1c0 1.4 1.1 2.5 2.5 2.5h2.9c.4 0 .8-.3.8-.8 0-.4-.3-.8-.8-.8H4.8c-.6 0-1-.5-1-1V7.9c0-.3.4-.7 1-.7H18c.6 0 1 .4 1 .7v1.8c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-5c-.1-1.4-1.2-2.5-2.6-2.5zm1 3.7c-.3-.1-.7-.2-1-.2H4.8c-.4 0-.7.1-1 .2V4.7c0-.6.5-1 1-1h1.3v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5h7.5v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5H18c.6 0 1 .5 1 1v1.2z"
											fill="#1d9bf0"
										></path>
										<path
											d="M15.5 10.4c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2 3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2zm0 11c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7c0 2.5-2.1 4.7-4.7 4.7z"
											fill="#1d9bf0"
										></path>
										<path
											d="M18.9 18.7c-.1.2-.4.4-.6.4-.1 0-.3 0-.4-.1l-3.1-2v-3c0-.4.3-.8.8-.8.4 0 .8.3.8.8v2.2l2.4 1.5c.2.2.3.6.1 1z"
											fill="#1d9bf0"
										></path>
									</g>
								</svg>
							</div>
						</div>
						<div className="absolute right-0">
							<button
								className="bg-blue-500 text-[13px] text-white font-semibold p-1 rounded-full  mt-4 shadow-xs hover:bg-dblue transition-all"
								onClick={() => console.log('Create Tweet')}
							>
								<span className="p-4">Tweet</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TweetBox;
