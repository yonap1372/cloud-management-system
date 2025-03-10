const express = require("express");
const router = express.Router();
const pool = require("../config/database");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, email, role FROM users");
        res.json(result.rows);
    } catch (error) {
        console.error("⚠️ Error obteniendo usuarios:", error);
        res.status(500).json({ error: "Error obteniendo usuarios" });
    }
});

router.post("/", async (req, res) => {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *",
            [name, email, role]
        );
        res.json({ message: "Usuario agregado", user: result.rows[0] });
    } catch (error) {
        console.error("⚠️ Error agregando usuario:", error);
        res.status(500).json({ error: "Error agregando usuario" });
    }
});

// 🚀 3️⃣ ELIMINAR UN USUARIO (DELETE /api/users/:id)
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        console.error("⚠️ Error eliminando usuario:", error);
        res.status(500).json({ error: "Error eliminando usuario" });
    }
});

module.exports = router;
