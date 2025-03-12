import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getClusters, scaleCluster } from "../services/api";
import "../styles/Clusters.css";

function Clusters() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scaling, setScaling] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClusters();
      setClusters(data);
    } catch (err) {
      setError("⚠️ Error al obtener clústeres");
    } finally {
      setLoading(false);
    }
  };

  const handleScale = async (id, newReplicas) => {
    if (!id || newReplicas < 1) {
      setError("⚠️ Error: Datos inválidos para escalar.");
      return;
    }
    setScaling(id);
    try {
      await scaleCluster(id, newReplicas);
      fetchClusters();
    } catch (err) {
      setError("⚠️ Error al escalar clúster.");
    } finally {
      setScaling(null);
    }
  };

  const filteredClusters = clusters.filter(cluster =>
    cluster.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <h1>Administración de Clústeres</h1>
        <input
          type="text"
          placeholder="Buscar clúster..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        {loading ? <p>Cargando...</p> : null}
        <table className="clusters-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Réplicas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClusters.map((cluster) => (
              <tr key={cluster.id}>
                <td>{cluster.name}</td>
                <td>{cluster.size || 1}</td>
                <td className={cluster.status === "running" ? "running" : "stopped"}>{cluster.status}</td>
                <td>
                  <button onClick={() => handleScale(cluster.id, cluster.size + 1)} disabled={scaling === cluster.id}>➕</button>
                  <button onClick={() => handleScale(cluster.id, Math.max(1, cluster.size - 1))} disabled={scaling === cluster.id}>➖</button>
                  {scaling === cluster.id && <span className="loading-text"> ⏳ Escalando...</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clusters;
