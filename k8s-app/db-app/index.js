const amqp = require('amqplib');

const { startProvider } = require('../provider/provider.js');
const { startClient } = require('../client/client.js');

const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: "10.101.189.141", 
  user: "root",
  password: "bukadanmi",
  database: "devopsacademy",
  port: 3306 
});


startProvider();

setTimeout(function() {
  console.log('Timeout çalıştı!');
}, 3000); 


startClient();


async function startApplication() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM messages'); //your_table_name
        console.log("Messages from database:", result.rows);
        client.release();
    } catch (error) {
        console.error('Error getting messages from database:', error);
    }
    
}

//startApplication();

