/**
 * Movie object from API
 * @typedef {Object} MovieRaw
 * @property {number} netflix_id - Unique identifier for the movie on Netflix.
 * @property {string} title - Title of the movie.
 * @property {string} title_type - Type of title, e.g., 'movie' or 'series'.
 * @property {string} img - URL for the movie's image.
 * @property {string} synopsis - Brief description of the movie.
 * @property {string} rating - Average rating of the movie.
 * @property {string} year - Year the movie was released.
 * @property {string} runtime - Runtime of the movie in minutes.
 * @property {string} imdb_id - IMDB identifier for the movie.
 * @property {string} poster - URL for the movie's poster.
 * @property {number} top250 - Ranking in the IMDB Top 250 movies list.
 * @property {number} top250tv - Ranking in the IMDB Top 250 TV shows list.
 * @property {string} title_date - Release or airing date of the title.
 */

/**
 * Movie object from Mongoose
 * @typedef {Object} MovieDocument
 * @property {string} _id - The unique identifier for the movie document in the database.
 * @property {string} netflix_id - The unique identifier for the movie on Netflix.
 * @property {number} __v - The version key used by Mongoose for document versioning.
 * @property {string[]} flixmate_category - Categories assigned to the movie, e.g., ['top-picks'].
 * @property {string} imdb_id - The unique identifier for the movie on IMDb.
 * @property {string} img - URL to the movie's image.
 * @property {string} poster - URL to the movie's poster.
 * @property {number} rating - Average user rating of the movie.
 * @property {number} runtime - Runtime of the movie in seconds.
 * @property {string} synopsis - A brief description of the movie's plot.
 * @property {string} title - The title of the movie.
 * @property {string} title_date - The release date of the movie in ISO 8601 format.
 * @property {string} title_type - The type of the title, e.g., 'movie'.
 * @property {number} top250 - Ranking of the movie in IMDb's Top 250 Movies list.
 * @property {number} top250tv - Ranking of the movie in IMDb's Top 250 TV shows list.
 * @property {number} year - The year the movie was released.
 */

/**
 * Movie object for mongoose Schema
 * @typedef {Object} MovieSchema
 * @property {string} netflix_id - Unique identifier for the movie on Netflix
 * @property {string} title - Title of the movie
 * @property {string[]} flixmate_category - Categories associated with the movie
 * @property {string} [title_type] - Type of the title, e.g., 'movie' or 'series'
 * @property {Date} [title_date] - Release or airing date of the title
 * @property {number} [year] - Year the movie was released
 * @property {number} [runtime] - Duration of the movie in minutes
 * @property {string} [synopsis] - Brief synopsis of the movie
 * @property {number} [rating] - Average rating of the movie
 * @property {string} [imdb_id] - IMDB identifier for the movie
 * @property {number} [top250] - Ranking in the IMDB Top 250 movies list
 * @property {number} [top250tv] - Ranking in the IMDB Top 250 TV shows list
 * @property {string} [img] - URL for the movie's image
 * @property {string} [poster] - URL for the movie's poster
 */

// This file needs to export something in order for js/ts type checks to work.
module.exports = {}
