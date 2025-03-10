import { useState, useEffect } from "react";
import Graph from "./Graph";
import { getMetricsLive } from "../services/api";
import "../styles/Dashboard.css";

function DashboardMain() {
  const [metrics, setMetrics] = useState([]);
  const [status, setStatus] = useState({ cpu: 0, ram: 0, network: 0 });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    getMetricsLive((newData) => {
      const newTime = newData.time || new Date().toLocaleTimeString();

      setStatus({
        cpu: Number(newData.cpu) || 0,
        ram: Number(newData.ram) || 0,
        network: Number(newData.network) || 0
      });

      setMetrics((prev) => [
        ...prev.slice(-30), // Mantener solo las últimas 30 lecturas
        { time: newTime, cpu: Number(newData.cpu) || 0, ram: Number(newData.ram) || 0, network: Number(newData.network) || 0 }
      ]);

      // Alertas mejoradas con múltiples niveles
      if (newData.cpu > 90) {
        setAlert("🚨 CRÍTICO: CPU extremadamente alta (> 90%)");
      } else if (newData.cpu > 80) {
        setAlert("⚠️ Advertencia: CPU en alto consumo (> 80%)");
      } else {
        setAlert(null);
      }
    });
  }, []);

  return (
    <div className="dashboard-main">
      <h1>Dashboard en Tiempo Real</h1>
      {alert && <div className="alert">{alert}</div>}

      <div className="status-cards">
        <div className="status-card">
          <h3>CPU Actual</h3>
          <p>{status.cpu.toFixed(2)}%</p>
        </div>
        <div className="status-card">
          <h3>RAM Actual</h3>
          <p>{status.ram.toFixed(2)}%</p>
        </div>
        <div className="status-card">
          <h3>Uso de Red</h3>
          <p>{status.network.toFixed(2)}%</p>
        </div>
      </div>

      <div className="graphs">
        <Graph title="Uso de CPU (%)" dataKey="cpu" data={metrics} />
        <Graph title="Uso de RAM (%)" dataKey="ram" data={metrics} />
        <Graph title="Tráfico de Red (%)" dataKey="network" data={metrics} />
      </div>
    </div>
  );
}

export default DashboardMain;
