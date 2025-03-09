const express = require("express");
const router = express.Router();

let clusterStatus = "Detenido";

router.get("/status", (req, res) => {
  res.json({ status: clusterStatus });
});

router.post("/start", (req, res) => {
  clusterStatus = "En ejecución";
  res.json({ message: "Clúster iniciado", status: clusterStatus });
});

router.post("/stop", (req, res) => {
  clusterStatus = "Detenido";
  res.json({ message: "Clúster detenido", status: clusterStatus });
});

router.post("/restart", (req, res) => {
  clusterStatus = "Reiniciando...";
  setTimeout(() => {
    clusterStatus = "En ejecución";
  }, 3000);
  res.json({ message: "Clúster reiniciando", status: clusterStatus });
});

module.exports = router;
