import DashboardSidebar from './dashboard/DashboardSidebar';
import DashboardContent from './dashboard/DashboardContent';

const Dashboard = () => {
	return (
		<div className="container grid grid-cols-10 m-auto">
			<DashboardSidebar />
			<DashboardContent />
		</div>
	);
};

export default Dashboard;
