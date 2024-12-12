const { Schema, model } = require('mongoose')

/**
 * @typedef {import('./movies.types').MovieSchema} MovieSchema
 */

/** @type {import('mongoose').Schema<MovieSchema>} */
const movieSchema = Schema({
	imdb_id: { type: String, required: true, unique: true },
	netflix_id: { type: String, required: true },
	title: { type: String, required: true },
	flixmate_category: { type: [String], required: true, enum: ['top-picks'] },
	title_type: { type: String, enum: ['movie', 'series'] },
	title_date: { type: Date, default: Date('1970-01-01') },
	year: { type: Number, default: 0 },
	runtime: { type: Number, default: 0 },
	synopsis: { type: String, default: '' },
	rating: { type: Number, default: 0 },
	top250: { type: Number, default: 0 },
	top250tv: { type: Number, default: 0 },
	img: {
		type: String,
		default: 'https://picsum.photos/160/230',
	},
	poster: {
		type: String,
		default: '',
	},
})

/** @type {import('mongoose').Model<MovieSchema>} */
const Movie = model('Movie', movieSchema)

module.exports = Movie
