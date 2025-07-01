const express = require('express');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('DB Connection Failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Hello from Dockerized Node.js App with Local MySQL!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
