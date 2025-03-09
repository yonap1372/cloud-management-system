require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const clusterRoutes = require("./routes/cluster");
const statusRoutes = require("./routes/status");
const protectedRoutes = require("./routes/protected");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/cluster", clusterRoutes);
app.use("/api/status", statusRoutes);
app.use("/api", protectedRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
