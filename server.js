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

// const weather = require('./data/weather.json');
//this allows anyone to access our server - aka - the worlds worst body guard
app.use(cors());

const superagent = require('superagent');

// app.use('*', (req, res) {
//   res.status(404).send('Page not found!')
// });

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

const PORT = process.env.PORT || 3002;

function Forecast(weatherDataObj) {
    this.description = `Low of ${weatherDataObj.low_temp}, high of ${weatherDataObj.high_temp} with ${weatherDataObj.weather.description.toLowerCase()}`;
    this.date = weatherDataObj.datetime;
  }

function Movie(movieResultObj) {
    this.title = movieResultObj.title;
    this.overview = movieResultObj.overview;
    this.release_date = movieResultObj.release_date;
    this.rating = movieResultObj.vote_average;
    this.poster_path = movieResultObj.poster_path;
  }  

app.get('/movies', (request, response) => {
  response.status(200).send('Hello World')
 })

app.get('/movies', (request, response) => {
  const city = request.query.city;
  const url = 'https://api.themoviedb.org/3/search/movie';
  const query = {
    query: city,
    api_key: process.env.MOVIE_API_KEY  
  }

  superagent
    .get(url)
    .query(query)
    .then(superagentResults => {
      console.log('results:', superagentResults.body.results);
      const movieObjArray = superagentResults.body.results.map(agent => new Movie(agent));
      console.log(movieObjArray);
      response.status(200).send(movieObjArray);
    })
})

app.get('/weather', (request, response) => {
  const lat = request.query.lat;
  const lon = request.query.lon;
  const url = 'https://api.weatherbit.io/v2.0/forecast/daily';
  const query = {
    lat: lat,
    lon: lon,
    key: process.env.WEATHER_API_KEY
  }

  superagent
    .get(url)
    .query(query)
    .then(superagentResults => {
      // console.log('data:', superagentResults.body.data);
      const weatherObjArray = superagentResults.body.data.map(agent => new Forecast(agent));
      // console.log(weatherObjArray);
      response.status(200).send(weatherObjArray);
    })
})  

// turn on the server
app.listen(PORT, () => console.log(`listening on ${PORT}`));
// three ways to do it:
// 1. node server.js
// 2. npm start
// 3. nodemon - this is going to check for changes and update
