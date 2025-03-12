import { useState, useEffect } from "react";
import { FaHome, FaServer, FaUsers, FaCog, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";

function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await getCurrentUser();
      setUser(data);
    }
    fetchUser();
  }, []);

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
        {user?.role === "admin" && (
          <li onClick={() => navigate("/users")}><FaUsers /> Usuarios</li>
        )}
        <li onClick={() => navigate("/scaling-history")}><FaChartLine /> Historial de Escalado</li>
        <li onClick={() => navigate("/settings")}><FaCog /> Configuración</li>
        <li onClick={handleLogout} className="logout"><FaSignOutAlt /> Cerrar Sesión</li>
      </ul>
    </div>
  );
}

export default Sidebar;
