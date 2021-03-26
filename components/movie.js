'use strict';

let cache = require('./cache.js');

const superagent = require('superagent');

function Movie(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.release_date = movieObj.release_date;
    this.rating = movieObj.vote_average;
    this.poster_path = movieObj.poster_path;
}  

function getMovies(request, response) {
    const city = request.query.city;
    const url = 'https://api.themoviedb.org/3/search/movie';
    const key = `movie-${city}`;
    const query = {
      query: city,
      api_key: process.env.MOVIE_API_KEY  
    }

    if (cache[key] && (Date.now() - cache[key].timestamp < 300000)) {
        console.log('Cache hit:', cache[key].data);
        response.status(200).send(cache[key].data)
      } else {
        console.log('Cache miss')  
        cache[key] = {};
        cache[key].timestamp = Date.now();
    
        superagent.get(url)
        .query(query)
        .then(superagentResults => {
            const movieSummaries = parseMovies(superagentResults.body);
            movieSummaries.then( value => {
                cache[key].data = value;    
                response.status(200).send(cache[key].data);
            });
        })
      }
      
    return cache[key].data;
}

function parseMovies(movieData) {
    try {
      const movieSummaries = movieData.results.map(movieObj => { 
        return new Movie(movieObj);
      });
      return Promise.resolve(movieSummaries);
    } catch (e) {
      return Promise.reject(e);
    }
  }

module.exports = getMovies;
