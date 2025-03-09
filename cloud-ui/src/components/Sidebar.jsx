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
        <li><FaHome /> Inicio</li>
        <li><FaServer /> Clústeres</li>
        <li><FaUsers /> Usuarios</li>
        <li><FaCog /> Configuración</li>
        <li onClick={handleLogout} className="logout"><FaSignOutAlt /> Cerrar Sesión</li>
      </ul>
    </div>
  );
}

export default Sidebar;
