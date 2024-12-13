const protected = require('../../middlewares/protected')
const roomsRouter = require('express').Router()
const router = require('express').Router()
const {
  getRooms,
  getRoombyId,
  createRoom,
  deleteRoomById,
  addUserToRoom,
  removeUserFromRoom,
  changeRoomMovie,
} = require('./rooms.services')

const { getUserFromJWT } = require('../users/users.services')

roomsRouter.get('/', async (req, res, next) => {
  try {
    const rooms = await getRooms()
    res.status(200).json(rooms)
  } catch (error) {
    next(error)
  }
})

roomsRouter.get('/:roomId', async (req, res, next) => {
  try {
    console.log(req.params.roomId)
    const room = await getRoombyId(req.params.roomId)
    res.status(200).json(room)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

roomsRouter.post('/', async (req, res, next) => {
  try {
    const roomInfo = req.body
    roomInfo.owner = await getUserFromJWT(req.token)
    const room = await createRoom(roomInfo)
    res.status(200).json(room)
  } catch (error) {
    next(error)
  }
})

router.use('/rooms', protected, roomsRouter)
module.exports = router
