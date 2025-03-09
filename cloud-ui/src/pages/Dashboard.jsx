import Sidebar from "../components/Sidebar";
import DashboardMain from "../components/DashboardMain";
import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <DashboardMain />
    </div>
  );
}

export default Dashboard;
