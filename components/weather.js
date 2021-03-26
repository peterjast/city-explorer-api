'use strict';

let cache = require('./cache.js');

const superagent = require('superagent');

function getWeather(request, response) {
  const lat = request.query.lat;
  const lon = request.query.lon;
  const key = `weather-${lat}-${lon}`;
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const query = {
    key: process.env.WEATHER_API_KEY,
    lat: lat,
    lon: lon,
    days: 16
  };

  if (cache[key] && (Date.now() - cache[key].timestamp < 300000)) {
    console.log('Cache hit:', cache[key].data);
    response.status(200).send(cache[key].data)
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();

    superagent.get(url)
    .query(query)
    .then(superagentResults => {
        const weatherSummaries = parseWeather(superagentResults.body);
        weatherSummaries.then( value => {  
            cache[key].data = value;    
            response.status(200).send(cache[key].data);
        });
    })
  }
  
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => { 
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description.toLowerCase()}`;
    this.date = day.datetime;
  }
}

module.exports = getWeather;
