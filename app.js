require('dotenv').config();
const mysql = require('mysql2');

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
  } else {
    console.log("🚀 Connected to MySQL Database");
  }
});

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("🚀 App running and connected to MySQL");
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
