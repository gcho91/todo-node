require("dotenv").config();
const { Pool } = require("pg");

console.log("DB_HOST!!:", process.env.DB_HOST);
console.log("DB_USER!!:", process.env.DB_USER);
console.log("DB_PASSWORD!!:", process.env.DB_PASSWORD);
console.log("DB_PORT!!:", process.env.DB_PORT);
console.log("DB_NAME!!:", process.env.DB_NAME);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Skip SSL validation for managed DBs
  },
});

module.exports = pool;
