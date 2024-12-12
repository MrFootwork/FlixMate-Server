const protected = require('../../middlewares/protected')
const {
	getMovies,
	getMoviesFromAPI,
	updateMovies,
} = require('./movies.services')

const moviesRouter = require('express').Router()
const router = require('express').Router()

moviesRouter.put('/refresh', async (req, res, next) => {
	try {
		const movies = await getMoviesFromAPI()
		const { found, modified, upserted } = await updateMovies(movies)

		res.status(200).json({
			message: `Found ${found} of which ${modified} were modified. ${upserted} were inserted. 🎉`,
		})
	} catch (error) {
		next(error)
	}
})

moviesRouter.get('/', async (req, res, next) => {
	try {
		const movies = await getMovies()
		res.status(200).json(movies)
	} catch (error) {
		next(error)
	}
})

router.use('/movies', protected, moviesRouter)
module.exports = router
