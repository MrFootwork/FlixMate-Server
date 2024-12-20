const router = require('express').Router()
const usersRoutes = require('./users/users.routes')
const moviesRoutes = require('./movies/movies.routes')
const roomsRoutes = require('./rooms/rooms.routes')
const mongoose = require('mongoose')
const path = require('path')
const protected = require('../middlewares/protected')

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

router.use(
  '/download-extension',
  protected,
  require('express')
    .Router()
    .get('/', (req, res) => {
      const filePath = path.join(
        __dirname,
        '..',
        'assets',
        'FlixMate-Extension.zip'
      )

      res.download(filePath, 'example.zip', err => {
        if (err) {
          console.error('Error downloading file:', err)
          res.status(500).send('Failed to download file.')
        }
      })
    })
)

module.exports = router
