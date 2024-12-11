const roomsRouter = require('express').Router()
const router = require('express').Router()

roomsRouter.get('/', (req, res) => {
  //
})

router.use('/rooms', roomsRouter)
module.exports = router
