const { Pool } = require("pg");

const pool = new Pool({
  user: "gcho91",
  password: "",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "todo-app",
});

// module.exports = {
// query: (text, params) => pool.query(text, params),
// };

module.exports = pool;
