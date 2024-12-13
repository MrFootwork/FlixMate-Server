const router = require('express').Router()
const usersRoutes = require('./users/users.routes')
const moviesRoutes = require('./movies/movies.routes')
const roomsRoutes = require('./rooms/rooms.routes')

router.use(usersRoutes)
router.use(moviesRoutes)
router.use(roomsRoutes)

module.exports = router
