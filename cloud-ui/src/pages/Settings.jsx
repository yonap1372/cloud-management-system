import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Settings() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <h1>Configuración</h1>
        <p>Ajustes generales del sistema.</p>
      </div>
    </div>
  );
}

export default Settings;
