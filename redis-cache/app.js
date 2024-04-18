const express = require('express');
const { createPool } = require('mysql2/promise'); 
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;


const pool = createPool({
  host: "mysql_container",
  user: "root",
  password: "root",
  database: "blog_db",
  port: 3306
});

// Redis connection 
const redisClient = redis.createClient({
    host: 'redis_container', 
    port: 6379 
});


(async () => {
  try {
    await redisClient.connect();
    
    console.log('Connected to Redis server');

  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
})();



app.get('/data/:key', async (req, res) => {
  const key = req.params.key;

  try {
    // Retrieve data from Redis with error handling
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log('Data retrieved from Redis cache');
      return res.json(JSON.parse(cachedData));
    }

    const [rows] = await pool.query('SELECT * FROM blog WHERE blog_id = ?', [key]);
    if (rows.length > 0) {
      const rowData = rows[0];
      await redisClient.set(key, JSON.stringify(rowData)); 
      console.log('Data cached in Redis');
      return res.json(rowData);
    } else {
      return res.status(404).send('Data not found');
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
