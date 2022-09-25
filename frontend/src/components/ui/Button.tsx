import { MouseEventHandler } from 'react';

interface Props {
	text: String;
	onClick: MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ text, onClick }: Props) => {
	return (
		<button
			className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full"
			onClick={onClick}
		>
			{text}
		</button>
	);
};

export default Button;
