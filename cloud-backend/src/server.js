require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const { Server } = require("socket.io");
const http = require("http");
const axios = require("axios");

const authRoutes = require("./routes/auth");
const clusterRoutes = require("./routes/cluster");
const statusRoutes = require("./routes/status");
const usersRoutes = require("./routes/users");
const scalingRoutes = require("./routes/scaling");
const scalingHistoryRoutes = require("./routes/scalingHistory");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const PROMETHEUS_URL = "http://10.43.70.249:9090/api/v1/query";
const AUTOESCALADO_ACTIVO = true;
let historialCPU = [];
let replicasActuales = 2;
let ultimaAlerta = null;

const fetchMetrics = async () => {
  try {
    const [cpuResponse, ramResponse, netResponse] = await Promise.all([
      axios.get(PROMETHEUS_URL, { params: { query: "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)" } }),
      axios.get(PROMETHEUS_URL, { params: { query: "node_memory_Active_bytes / node_memory_MemTotal_bytes * 100" } }),
      axios.get(PROMETHEUS_URL, { params: { query: "rate(node_network_receive_bytes_total[5m])" } })
    ]);

    return {
      cpu: Number(cpuResponse.data.data.result[0]?.value[1] || 0).toFixed(2),
      ram: Number(ramResponse.data.data.result[0]?.value[1] || 0).toFixed(2),
      network: Number(netResponse.data.data.result[0]?.value[1] || 0).toFixed(2),
      time: new Date().toISOString()
    };
  } catch (error) {
    console.error("⚠️ Error obteniendo métricas:", error.message);
    return { cpu: 0, ram: 0, network: 0, time: new Date().toISOString() };
  }
};

const logScalingEvent = async (clusterName, previousReplicas, newReplicas) => {
  try {
    const result = await pool.query(
      "INSERT INTO scaling_history (cluster_name, previous_replicas, new_replicas) VALUES ($1, $2, $3)",
      [clusterName, previousReplicas, newReplicas]
    );

    console.log(`📌 Historial registrado: ${clusterName} pasó de ${previousReplicas} a ${newReplicas} réplicas.`);
  } catch (error) {
    console.error("⚠️ Error registrando historial de escalado:", error);
  }
};


const scaleCluster = async (clusterName, newReplicas) => {
  if (newReplicas !== replicasActuales) {
    exec(`kubectl scale deployment ${clusterName} --replicas=${newReplicas}`, async (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error al escalar:", stderr);
      } else {
        console.log(`✅ Clúster ${clusterName} escalado a ${newReplicas} réplicas`);

        await logScalingEvent(clusterName, replicasActuales, newReplicas);

        replicasActuales = newReplicas;
        io.emit("escalado", { message: `Clúster ${clusterName} escalado a ${newReplicas} réplicas` });
        io.emit("notification", { type: "ESCALADO", message: `Se escaló ${clusterName} a ${newReplicas} réplicas.` });
      }
    });
  }
};


setInterval(async () => {
  const { cpu } = await fetchMetrics();
  historialCPU.push(cpu);
  if (historialCPU.length > 12) historialCPU.shift();

  if (AUTOESCALADO_ACTIVO && historialCPU.length === 12) {
    const avgCPU = historialCPU.reduce((a, b) => a + parseFloat(b), 0) / historialCPU.length;
    let newReplicas = replicasActuales;

    if (avgCPU > 80 && replicasActuales < 5) {
      newReplicas = Math.min(replicasActuales + 1, 5);
    } else if (avgCPU < 40 && replicasActuales > 2) {
      newReplicas = Math.max(replicasActuales - 1, 2);
    }

    if (newReplicas !== replicasActuales) {
      scaleCluster(newReplicas);
    }
  }
}, 10000);

io.on("connection", (socket) => {
  console.log(`🔗 Cliente conectado: ${socket.id}`);

  const sendMetrics = async () => {
    const metrics = await fetchMetrics();
    socket.emit("metrics", metrics);

    let alertaActual = null;
    if (metrics.cpu > 90) {
      alertaActual = "🚨 CRÍTICO: CPU extremadamente alta (> 90%)";
    } else if (metrics.cpu > 80) {
      alertaActual = "⚠️ Advertencia: CPU en alto consumo (> 80%)";
    }

    if (alertaActual !== ultimaAlerta) {
      ultimaAlerta = alertaActual;
      socket.emit("alert", { message: alertaActual });
      io.emit("notification", { type: "ALERTA", message: alertaActual });
    }
  };

  sendMetrics();
  const interval = setInterval(sendMetrics, 5000);

  socket.on("disconnect", () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
    clearInterval(interval);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/clusters", clusterRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/scaling", scalingRoutes);
app.use("/api/scaling-history", scalingHistoryRoutes);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
