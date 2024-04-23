const mysql = require("mysql2");

const connection = mysql.createPool({
  connectionLimit: 100,
  host: "10.244.0.200",  //Pod IP
  user: "root",
  port: "3306",
  password: "bukadanmi",
  database: "blog_db",
});

module.exports = connection;