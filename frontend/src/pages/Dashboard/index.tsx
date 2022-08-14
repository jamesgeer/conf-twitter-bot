import Sidebar from './Sidebar';
import Content from './Content';

const Index = () => {
	return (
		<div className="container grid grid-cols-10 m-auto">
			<Sidebar />
			<Content />
		</div>
	);
};

export default Index;
