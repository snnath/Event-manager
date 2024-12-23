const Pool = require("pg").Pool;

const pool = new Pool({
  user: "sohannath",
  password: "",
  host: "localhost",
  port: 5432,
  database: "event_management"
});

module.exports = pool;