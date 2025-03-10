const express = require("express");
const axios = require("axios");
const router = express.Router();

const PROMETHEUS_URL = "http://10.43.70.249:9090/api/v1/query";

router.get("/", async (req, res) => {
  try {
    const [cpuResponse, ramResponse, netResponse] = await Promise.all([
      axios.get(PROMETHEUS_URL, { params: { query: "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)" } }),
      axios.get(PROMETHEUS_URL, { params: { query: "node_memory_Active_bytes / node_memory_MemTotal_bytes * 100" } }),
      axios.get(PROMETHEUS_URL, { params: { query: "rate(node_network_receive_bytes_total[5m])" } })
    ]);

    res.json({
      cpu: parseFloat(cpuResponse.data.data.result[0]?.value[1] || 0).toFixed(2),
      ram: parseFloat(ramResponse.data.data.result[0]?.value[1] || 0).toFixed(2),
      network: parseFloat(netResponse.data.data.result[0]?.value[1] || 0).toFixed(2),
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error obteniendo métricas:", error);
    res.status(500).json({ error: "Error obteniendo métricas del sistema" });
  }
});

module.exports = router;
