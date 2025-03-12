const express = require("express");
const router = express.Router();
const { fetchMetrics } = require("../services/metricsService");

router.get("/", async (req, res) => {
    try {
        const metrics = await fetchMetrics();
        res.json(metrics);
    } catch (error) {
        console.error("Error obteniendo métricas:", error);
        res.status(500).json({ error: "Error obteniendo métricas" });
    }
});

module.exports = router;
