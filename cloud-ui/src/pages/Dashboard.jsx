import Sidebar from "../components/Sidebar";
import DashboardMain from "../components/DashboardMain";
import Notifications from "../components/Notifications";
import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <DashboardMain />
        <Notifications />
      </div>
    </div>
  );
}

export default Dashboard;
