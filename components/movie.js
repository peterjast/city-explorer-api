'use strict';

const superagent = require('superagent');

function Movie(movieResultObj) {
    this.title = movieResultObj.title;
    this.overview = movieResultObj.overview;
    this.release_date = movieResultObj.release_date;
    this.rating = movieResultObj.vote_average;
    this.poster_path = movieResultObj.poster_path;
}  

function getMovies(request, response) {
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
}

module.exports = getMovies;