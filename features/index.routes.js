const router = require('express').Router()
const usersRoutes = require('./users/users.routes')
const moviesRoutes = require('./movies/movies.routes')
const roomsRoutes = require('./rooms/rooms.routes')
const mongoose = require('mongoose')

router.use(usersRoutes)
router.use(moviesRoutes)
router.use(roomsRoutes)

router.get('/health', async (req, res) => {
  try {
    const response = await mongoose.connection.db.admin().ping()
    console.log(`🚀 ~ router.get ~ DB Ping:`, response)

    if (!response.ok) throw new Error('MongoDB Ping Failed')

    res.status(200).json({ status: 'UP', database: 'Connected' })
  } catch (error) {
    res
      .status(500)
      .json({ status: 'DOWN', database: 'Disconnected', error: error.message })
  }
})

module.exports = router
