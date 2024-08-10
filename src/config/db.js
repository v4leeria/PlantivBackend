const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  connectionTimeoutMillis: 5000,
});
console.log("DB_URL:", process.env.DB_URL);

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error ejecutando la consulta", err);
  } else {
    console.log("Hora actual:", res.rows[0]);
  }
});
module.exports = pool;
