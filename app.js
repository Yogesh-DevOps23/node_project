const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected to MySQL');
  connection.release();

  app.get('/', (req, res) => {
    res.send('🚀 Node.js + MySQL backend is live!');
  });

  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
});
