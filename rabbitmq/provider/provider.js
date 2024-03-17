const amqp = require('amqplib');


const rabbitmqSettings = {
    protocol: 'amqp',
    hostname: '172.21.0.4',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']
}


async function startProvider() {

    const msgs = [
        {"name":"dilara", "msg":"SistersLab"},
        {"name":"dilara", "msg":"DevOps Academy"},
        {"name":"john_doe", "msg":"Anonymous"}
    ]


    try {
        
        const conn = await amqp.connect(rabbitmqSettings);  //rabbitmq connection
        console.log("connection created");

        const channel = await conn.createChannel();
        console.log("channel created");

        const queue = "queue_name";
        const res = await channel.assertQueue(queue);

        for(let msg in msgs){
            await channel.sendToQueue(queue, Buffer.from(JSON.stringify(msgs[msg])));
            console.log('message sent to queue');
        }



    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }

    setTimeout(function() {
        //connection.close();   cant access connection because connection object closes
        //process.exit(0)
        }, 2000);
}


module.exports = {
    startProvider: startProvider
};