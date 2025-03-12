const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const bcrypt = require("bcryptjs");

router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Acceso denegado, permisos insuficientes" });
        }

        const result = await pool.query("SELECT id, name, email, role FROM users");
        res.json(result.rows);
    } catch (error) {
        console.error("⚠️ Error obteniendo usuarios:", error);
        res.status(500).json({ error: "Error obteniendo usuarios" });
    }
});


router.post("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, role]
        );
        res.json({ message: "✅ Usuario agregado", user: result.rows[0] });
    } catch (error) {
        console.error("⚠️ Error agregando usuario:", error);
        res.status(500).json({ error: "Error agregando usuario" });
    }
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [req.user.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("⚠️ Error obteniendo datos del usuario:", error);
        res.status(500).json({ error: "Error obteniendo datos del usuario" });
    }
});

module.exports = router;
