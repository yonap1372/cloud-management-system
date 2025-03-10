import { FaHome, FaServer, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Cloud Manager</h2>
      <ul>
        <li onClick={() => navigate("/dashboard")}><FaHome /> Inicio</li>
        <li onClick={() => navigate("/clusters")}><FaServer /> Clústeres</li>
        <li onClick={() => navigate("/users")}><FaUsers /> Usuarios</li>
        <li onClick={() => navigate("/settings")}><FaCog /> Configuración</li>
        <li onClick={handleLogout} className="logout"><FaSignOutAlt /> Cerrar Sesión</li>
      </ul>
    </div>
  );
}

export default Sidebar;
