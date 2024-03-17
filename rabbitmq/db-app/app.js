const amqp = require('amqplib');

const { startProvider } = require('../provider/provider.js');
const { startClient } = require('../client/client.js');

const { Pool } = require('pg');

const pool = new Pool({
  connectionLimit: 100,
  host: "172.21.0.2", 
  user: "root",
  password: "root",
  database: "homework_2",
  port: 5432 
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

