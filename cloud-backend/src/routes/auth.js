const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Faltan datos en la solicitud" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("⚠️ Error al registrar usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos en la solicitud" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Credenciales inválidas" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("⚠️ Error en el login:", error);
    res.status(500).json({ error: "Error en el servidor" });
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
    console.error("⚠️ Error obteniendo usuario actual:", error);
    res.status(500).json({ error: "Error obteniendo usuario actual" });
  }
});

module.exports = router;
