const router = require('express').Router()
const usersRoutes = require('./users/users.routes')
const moviesRoutes = require('./movies/movies.routes')

router.use(usersRoutes)
router.use(moviesRoutes)

module.exports = router
