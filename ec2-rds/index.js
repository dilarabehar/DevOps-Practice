const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();


const connection = require("./helper/mysql");

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});


app.use(bodyParser.json());

app.post('/data', (req, res) => {
  const data = req.body;
  const query = 'INSERT INTO users SET ?';

  connection.query(query, data, (error, results, fields) => {
    if (error) {
      console.error('Error inserting data: ', error);
      res.status(500).send('Error inserting data');
      return;
    }

    res.status(201).send('Data inserted successfully');
  });
});


app.get('/data', (req, res) => {
  const query = 'SELECT * FROM users';

  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error retrieving data: ', error);
      res.status(500).send('Error retrieving data');
      return;
    }

    res.status(200).json(results);
  });
});


app.listen(3000, () => {
  console.log(`Server is running on 3000`);
});
