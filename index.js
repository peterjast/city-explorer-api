'use strict';
// bring in the express libraray
// don't forget to do an npm install express
const express = require('express');
//allows us to access our env variables
require('dotenv').config();
//allow our front-end to access our server
const cors = require('cors');
// initalizing the express library so I can use it
const app = express();

const weather = require('./data/weather.json');
//this allows anyone to access our server - aka - the worlds worst body guard
app.use(cors());

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

const PORT = process.env.PORT || 3000;

function Forecast(weatherDataObj) {
    this.description = `Low of ${weatherDataObj.low_temp}, high of ${weatherDataObj.high_temp} with ${weatherDataObj.weather.description.toLowerCase()}`;
    this.date = weatherDataObj.datetime;
  }

const forecastArr = weather.data.map(weatherObj => new Forecast(weatherObj));

app.get('/', function (request, response) {
  response.send('Hello World')
})

app.get('/weather/:lat/:long', (request, response) => {
    response.send(forecastArr);
})

// turn on the server
app.listen(PORT, () => console.log(`listening on ${PORT}`));
// three ways to do it:
// 1. node server.js
// 2. npm start
// 3. nodemon - this is going to check for changes and update