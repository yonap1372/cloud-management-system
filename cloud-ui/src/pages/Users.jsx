import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getUsers, addUser, deleteUser } from "../services/api";
import "../styles/Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("⚠️ Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      setError("⚠️ Todos los campos son obligatorios.");
      return;
    }

    try {
      await addUser(newUser);
      fetchUsers();
      setNewUser({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      setError("⚠️ Error al agregar usuario.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      setError("⚠️ Error al eliminar usuario.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <h1>Gestión de Usuarios</h1>

        {error && <p className="error">{error}</p>}
        {loading ? <p>Cargando...</p> : null}

        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <form className="add-user-form" onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Nombre"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            required
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit">Agregar Usuario</button>
        </form>

        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user.id)}>🗑 Eliminar</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
