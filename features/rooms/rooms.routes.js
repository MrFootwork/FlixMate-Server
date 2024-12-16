const protected = require('../../middlewares/protected')
const roomsRouter = require('express').Router()
const router = require('express').Router()
const http = require('http')
const io = require('socket.io')
const { Server } = require('socket.io')

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

function socketServer(app) {
  const server = http.createServer(app)
  const io = require('socket.io')(server, {
    cors: {
      origin: 'https://www.netflix.com',
    },
  })

  io.use(async (socket, next) => {
    try {
      // console.log(socket)
      const user = await getUserFromJWT(socket.handshake.auth.token)
      // You can now just grab the user tied to the request on each socket handler
      // It's easy to see who sent an event, no need to send the user info from the client, which is more secure
      socket.user = user
      console.log('Connected: ', socket.user)
      next()
    } catch (error) {
      const err = new Error('not authorized')
      console.log('Not authorized')
      err.data = { content: 'Please retry later' } // additional details
      next(err)
    }
  })

  io.on('connection', socket => {
    console.log('joined ', socket.user)
    addListenersToSocket(socket)
  })

  return server
}

function addListenersToSocket(socket) {
  socket.on('join-room', room => {
    console.log(socket.user.name, ' joined room ', room)
    socket.room = room
    socket.join(room)
    socket.emit('joined-room')
  })
}

router.use('/rooms', protected, roomsRouter)
module.exports = router
module.exports.socketServer = socketServer
