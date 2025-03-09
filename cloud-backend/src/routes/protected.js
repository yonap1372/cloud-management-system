const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/protected-route', authMiddleware, (req, res) => {
  res.json({ message: 'Acceso autorizado', user: req.user });
});

module.exports = router;
