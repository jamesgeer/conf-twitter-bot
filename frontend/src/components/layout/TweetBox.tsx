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
					<img className="w-[48px] h-auto rounded-full" src={activeAccount.profileImageUrl} alt="profile" />
				</div>

				<div className="text-xl mt-2 w-full">
					<textarea
						className="w-full resize-none outline-none placeholder:text-sgray placeholder:text-opacity-75 overflow-hidden"
						placeholder="What's on your mind?"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					></textarea>
					<div className="flex items-center justify-between border-t-1 border-slate-100">
						<div className="flex items-center pt-1"></div>
						<div className="absolute right-0">
							<button
								className="bg-blue-500 text-[13px] text-white font-semibold p-1 rounded-full mt-4 shadow-xs hover:bg-dblue transition-all"
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
