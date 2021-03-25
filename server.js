'use strict';
//allows us to access our env variables
require('dotenv').config();
// bring in the express libraray
// don't forget to do an npm install express
const express = require('express');
// initalizing the express library so I can use it
const app = express();
//allow our front-end to access our server
const cors = require('cors');
//this allows anyone to access our server - aka - the worlds worst body guard
app.use(cors());

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 3002;

const getWeather = require('./components/weather');
const getMovies = require('./components/movie');

app.get('/weather', getWeather);

app.get('/movies', getMovies);
// turn on the server
app.listen(PORT, () => console.log(`listening on ${PORT}`));
