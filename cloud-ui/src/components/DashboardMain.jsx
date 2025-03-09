import { useState, useEffect } from "react";
import Graph from "./Graph";
import { getSystemStatus } from "../services/api";
import "../styles/Dashboard.css";

function DashboardMain() {
  const [cpuData, setCpuData] = useState([]);
  const [ramData, setRamData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [status, setStatus] = useState({ cpu: 0, ram: 0, network: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const newData = await getSystemStatus();
      if (newData) {
        setStatus(newData);
        const newTime = newData.time;
        
        setCpuData((prev) => [...prev.slice(-10), { time: newTime, value: newData.cpu }]);
        setRamData((prev) => [...prev.slice(-10), { time: newTime, value: newData.ram }]);
        setNetworkData((prev) => [...prev.slice(-10), { time: newTime, value: newData.network }]);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-main">
      <h1>Bienvenido al Dashboard</h1>
      <p>Monitoreo de Clústeres en Tiempo Real</p>
      
      <div className="status-cards">
        <div className="status-card">
          <h3>Clústeres Activos</h3>
          <p>5</p>
        </div>
        <div className="status-card">
          <h3>Uso de CPU</h3>
          <p>{status.cpu.toFixed(2)}%</p>
        </div>
        <div className="status-card">
          <h3>Uso de RAM</h3>
          <p>{status.ram.toFixed(2)}%</p>
        </div>
      </div>

      <div className="graphs">
        <Graph title="Uso de CPU (%)" dataKey="value" data={cpuData} />
        <Graph title="Uso de RAM (%)" dataKey="value" data={ramData} />
        <Graph title="Uso de Red (%)" dataKey="value" data={networkData} />
      </div>
    </div>
  );
}

export default DashboardMain;
