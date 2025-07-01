const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message || err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL");
});

app.get("/", (req, res) => {
  res.send("🚀 App running and connected to MySQL");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
