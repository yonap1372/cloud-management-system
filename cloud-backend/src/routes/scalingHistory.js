const express = require("express");
const router = express.Router();
const pool = require("../config/database");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM scaling_history ORDER BY timestamp DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("⚠️ Error obteniendo historial de escalado:", error);
        res.status(500).json({ error: "Error obteniendo historial de escalado" });
    }
});

module.exports = router;
