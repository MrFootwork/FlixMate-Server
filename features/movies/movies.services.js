const axios = require('axios')
const Movie = require('./movies.models')
const options = require('./movies.config')

/**
 * @typedef {import('./movies.types').MovieRaw} MovieRaw
 */

/**
 * Fetches a list of movies from an external API.
 *
 * @async
 * @function getMoviesFromAPI
 * @returns {Promise<MovieRaw[]>} A promise that resolves to an array of movie objects.
 * @throws {Error} Throws an error if the API request fails.
 *
 * @example
 * // Example usage:
 * getMoviesFromAPI().then(movies => {
 *   console.log(movies[0].title); // "Beautiful Wedding"
 * });
 */
async function getMoviesFromAPI() {
  try {
    const movies = (await axios.request(options.topPicks)).data.results

    return movies
  } catch (error) {
    throw error
  }
}

/**
 * Updates or inserts movies into the database.
 *
 * @async
 * @function updateMovies
 * @param {MovieRaw[]} movies - An array of movie objects to be updated or inserted into the database.
 * @returns {Promise<{found: number, modified: number, upserted: number}>} A promise that resolves to an object with update statistics.
 * @throws {Error} Throws an error if the bulk operation fails.
 *
 * @example
 * const movies = [
 *   {
 *     title: 'Beautiful Wedding',
 *     netflix_id: 81902293,
 *     year: '2024',
 *     runtime: '5666',
 *     synopsis: 'Waking up married after an epic bender in Las Vegas...',
 *     // other fields...
 *   },
 * ];
 *
 * updateMovies(movies).then(result => {
 *   console.log(result); // { found: 1, modified: 1, upserted: 0 }
 * });
 */
async function updateMovies(movies) {
  const sanitizedMovies = movies.map(movie => ({
    ...movie,
    flixmate_category: ['top-picks'],
  }))

  const updateOrInsert = sanitizedMovies.map(doc => ({
    updateOne: {
      filter: { imdb_id: doc.imdb_id },
      update: { $set: doc }, // Update the whole document
      upsert: true, // Insert the document if it doesn't exist
    },
  }))

  try {
    const result = await Movie.bulkWrite(updateOrInsert)

    return {
      found: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
    }
  } catch (error) {
    throw error
  }
}

/**
 * Fetches all movies from the database.
 *
 * @async
 * @function getMovies
 * @returns {Promise<MovieDocument[]>} A promise that resolves to an array of `MovieDocument` objects.
 * @throws {Error} Throws an error if the database query fails.
 *
 * @example
 * getMovies().then(movies => {
 *   console.log(movies[0].title); // Outputs the title of the first movie
 * });
 */
async function getMovies() {
  try {
    // top 10 movies with highest rating
    return await Movie.find({}).sort({ rating: -1 }).limit(10)
  } catch (error) {
    throw error
  }
}

async function searchForMovies(searchString) {
  try {
    const searchOption = {
      ...options.titleSearch,
      params: {
        ...options.titleSearch.params,
        title: searchString,
      },
    }

    const response = await axios.request(searchOption)

    return response.data.results
  } catch (error) {
    throw error
  }
}

async function getActionShows() {
  try {
    // top 10 movies with highest rating
    const searchOption = {
      ...options.actionShows,
    }
    const response = await axios.request(searchOption)
    // console.log(response.data)
    return response.data
  } catch (error) {
    throw error
  }
}

async function getComedyBlockbusters() {
  try {
    // top 10 movies with highest rating
    const searchOption = {
      ...options.comedyBlockBusters,
    }
    const response = await axios.request(searchOption)
    // console.log(response.data)
    return response.data
  } catch (error) {
    throw error
  }
}

module.exports.getMoviesFromAPI = getMoviesFromAPI
module.exports.updateMovies = updateMovies
module.exports.getMovies = getMovies
module.exports.searchForMovies = searchForMovies
module.exports.getActionShows = getActionShows
module.exports.getComedyBlockbusters = getComedyBlockbusters
