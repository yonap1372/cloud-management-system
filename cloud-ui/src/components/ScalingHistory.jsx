import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getScalingHistory } from "../services/api";
import "../styles/ScalingHistory.css";

function ScalingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getScalingHistory();
      setHistory(data);
    } catch (err) {
      setError("⚠️ Error al obtener historial de escalado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <h1>Historial de Escalado</h1>

        {error && <p className="error">{error}</p>}
        {loading ? <p>Cargando...</p> : null}

        <table className="history-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Antes</th>
              <th>Después</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td>{entry.previous_replicas}</td>
                <td>{entry.new_replicas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScalingHistory;
