const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    cpu: Math.random() * 100,
    ram: Math.random() * 100,
    network: Math.random() * 100,
    time: new Date().toLocaleTimeString()
  });
});

module.exports = router;
