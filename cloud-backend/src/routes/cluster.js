const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const pool = require("../config/database");

// Función para sanitizar nombres de clústeres
const formatClusterName = (name) => {
    return name
        .toLowerCase()       
        .replace(/[^a-z0-9.-]/g, "-")
        .replace(/^-+|-+$/g, "");
};

// 🚀 1️⃣ CREAR UN CLÚSTER (POST /api/clusters/create)
router.post("/create", async (req, res) => {
    let { name, size } = req.body;

    if (!name || !size) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    const validName = formatClusterName(name);

    if (!validName) {
        return res.status(400).json({ error: "El nombre del clúster no es válido" });
    }

    try {
        exec(`kubectl create deployment ${validName} --image=nginx --replicas=${size}`, async (error, stdout, stderr) => {
            if (error) return res.status(500).json({ error: `Error creando clúster: ${stderr}` });

            const result = await pool.query(
                "INSERT INTO clusters (name, size, status) VALUES ($1, $2, 'running') RETURNING *",
                [validName, size]
            );

            res.json({ message: `Clúster ${validName} creado`, cluster: result.rows[0] });
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

// 🚀 2️⃣ LISTAR TODOS LOS CLÚSTERES (GET /api/clusters)
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM clusters");
        res.json(result.rows);
    } catch (error) {
        console.error("Error obteniendo clústeres:", error);
        res.status(500).json({ error: "Error obteniendo clústeres" });
    }
});

// 🚀 3️⃣ ESCALAR UN CLÚSTER (POST /api/clusters/scale)
router.post("/scale", async (req, res) => {
    const { id, replicas } = req.body;

    if (!id || replicas === undefined || replicas === null) {
        return res.status(400).json({ error: "Faltan datos: ID y réplicas son obligatorios." });
    }

    try {
        const cluster = await pool.query("SELECT * FROM clusters WHERE id = $1", [id]);

        if (cluster.rows.length === 0) {
            return res.status(404).json({ error: "Clúster no encontrado" });
        }

        const clusterName = cluster.rows[0].name;
        exec(`kubectl scale deployment ${clusterName} --replicas=${replicas}`, async (error, stdout, stderr) => {
            if (error) return res.status(500).json({ error: `Error escalando clúster: ${stderr}` });

            await pool.query("UPDATE clusters SET size = $1 WHERE id = $2", [replicas, id]);
            res.json({ message: `Clúster ${clusterName} escalado a ${replicas} réplicas` });
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

// 🚀 4️⃣ ELIMINAR UN CLÚSTER (DELETE /api/clusters/:id)
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    try {
        const cluster = await pool.query("SELECT * FROM clusters WHERE id = $1", [id]);

        if (cluster.rows.length === 0) {
            return res.status(404).json({ error: "Clúster no encontrado" });
        }

        const clusterName = cluster.rows[0].name;
        exec(`kubectl delete deployment ${clusterName}`, async (error, stdout, stderr) => {
            if (error) return res.status(500).json({ error: `Error eliminando clúster: ${stderr}` });

            await pool.query("DELETE FROM clusters WHERE id = $1", [id]);
            res.json({ message: `Clúster ${clusterName} eliminado` });
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

module.exports = router;
