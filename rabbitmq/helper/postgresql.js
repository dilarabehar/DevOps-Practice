const { Pool } = require('pg');

const pool = new Pool({
  connectionLimit: 100,
  host: "172.20.0.2", 
  user: "root",
  password: "root",
  database: "homework_2",
  port: 5432 
});


module.exports = pool;