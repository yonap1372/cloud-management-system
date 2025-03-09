require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

pool.connect()
  .then(() => console.log("🟢 Conectado a PostgreSQL"))
  .catch(err => console.error("🔴 Error en conexión a PostgreSQL:", err));

module.exports = pool;
