const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'database-1.c34iuwogox5x.eu-west-1.rds.amazonaws.com',
    user: 'admin',
    password: '7lneBIihnYbA2ACPJwRZ',
    database: 'users'
  });

module.exports = connection; 