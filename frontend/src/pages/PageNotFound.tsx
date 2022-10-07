import { Link } from 'react-router-dom';

const PageNotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-[200px] font-medium">404</h1>
			<h3 className="text-2xl mb-20 font-semibold text-slate-500">Page Not Found</h3>
			<Link
				to="/"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48 text-center"
			>
				Back
			</Link>
		</div>
	);
};

export default PageNotFound;
