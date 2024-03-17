//const pool = require(' ../helper/postgresql ');
const amqp = require('amqplib');

//var amqp = require('amqplib/callback_api');

const { Pool } = require('pg');

const pool = new Pool({
  connectionLimit: 100,
  host: "172.21.0.2", 
  user: "root",
  password: "root",
  database: "homework_2",
  port: 5432 
});

const rabbitmqSettings = {
    protocol: 'amqp',
    hostname: '172.21.0.4',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']
}


function startClient() {
    amqp.connect(rabbitmqSettings)
        .then(conn => {
            console.log("connection created");
            return conn.createChannel();
        })                                                    //not sure .then but it works
        .then(channel => {
            console.log("channel created");
            const queue = "queue_name";
            return channel.assertQueue(queue)
                .then(() => {
                    channel.consume(queue, async message => { 
                        try {
                            const client = await pool.connect(); // Wait for connection (await usage)!
                            let employee = JSON.parse(message.content.toString());
                            const { name, msg } = employee;
                            await client.query('INSERT INTO your_table_name (name, message) VALUES ($1, $2)', [name, msg]); // Wait for query execution
                            console.log('Message inserted into database:', employee);
                            client.release();
                        } catch (error) {
                            console.error('Error processing message:', error);
                        }
                    });
                });
        })
        .then(() => {
            console.log("Client connected to RabbitMQ");
        })
        .catch(error => {
            console.error("Error connecting to RabbitMQ:", error);
        });
}

module.exports = {
    startClient: startClient
};
