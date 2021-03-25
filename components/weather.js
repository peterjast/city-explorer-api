'use strict';

const superagent = require('superagent');

function Forecast(weatherDataObj) {
    this.description = `Low of ${weatherDataObj.low_temp}, high of ${weatherDataObj.high_temp} with ${weatherDataObj.weather.description.toLowerCase()}`;
    this.date = weatherDataObj.datetime;
}

function getWeather(request, response) {
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
};

module.exports = getWeather;
  