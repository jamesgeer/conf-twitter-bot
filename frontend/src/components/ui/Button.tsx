interface Props {
	text: String;
}

const Button = ({ text }: Props) => {
	return (
		<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full">{text}</button>
	);
};

export default Button;
