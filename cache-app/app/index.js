const express = require("express");
const redis = require("redis");
const dbConnection = require("./helper/mysql");

const app = express();
const redisClient = redis.createClient({
  //host: "10.244.0.194",
  //port: 6379,
  url: "redis://10.244.0.194:6379"
});




dbConnection.getConnection((err, connection) => {
  if (err) {
    console.log("Error establishing MySQL connection: ", err);
  } else {
    console.log("MySQL connection successfully established.");
  }
});

redisClient.on("ready", function () {
  console.log("Redis connection successfully established.");
});

redisClient.on("error", function (error) {
  console.log("Redis Client Error: " + error);
});
redisClient.connect();

console.log("redis-yenideneme");

async function getBlogPostFromDb(blogId) {
  return new Promise((resolve, reject) => {
      dbConnection.getConnection((err, connection) => {
          if (err) {
              console.error("DB Connection error:", err);
              return reject(err);
          }
          connection.query('SELECT * FROM blogs WHERE blog_id = ?', [blogId], (error, results) => {
              connection.release();
              if (error) {
                  console.error("Query error:", error);
                  return reject(error);
              }
              resolve(results.length > 0 ? results[0] : null);
          });
      });
  });
}


app.get('/blog/:id', async (req, res) => {
  const blogId = req.params.id;
  try {
      // önce Redis'e cache için bak
      const cacheResult = await redisClient.get(blogId);
      if (cacheResult) {
          console.log('Data from Redis');
          return res.json(JSON.parse(cacheResult));
      } else {
          console.log('Data from Database');
          // Redis'te yoksa veritabanından çek
          const dbResult = await getBlogPostFromDb(blogId);
          if (dbResult) {
              // Veritabanından aldığın bilgileri Redis'e de ekle
              // yarım saatlik expire süresi verdim
              await redisClient.set(blogId, JSON.stringify(dbResult), {
                  EX: 1800, // Süresi 30 dakika olan bir key
              });
              return res.json(dbResult);
          } else {
              return res.status(404).send('Blog post not found');
          }
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000 vol 3");
});