import DashboardSidebar from './dashboard/DashboardSidebar';
import DashboardContent from './dashboard/DashboardContent';

const Dashboard = () => {
	return (
		<div>
			<h1 className="text-center text-4xl font-bold">Dashboard</h1>
			<DashboardSidebar />
			<DashboardContent />
		</div>
	);
};

export default Dashboard;
