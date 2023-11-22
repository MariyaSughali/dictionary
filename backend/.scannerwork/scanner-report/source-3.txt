const { Pool } = require("pg");

const pool = new Pool({
  database: "texta",
  host: "localhost",
  password: "131619",
  port: 5432,
  user: "postgres",
});

module.exports = pool;
