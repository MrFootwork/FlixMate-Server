const http = require('http')
const { getUserFromJWT } = require('./users/users.services')
const { getRoombyId, addUserToRoom } = require('./rooms/rooms.services')

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
  socket.on('join-room', async room => {
    try {
      const dbRoom = await getRoombyId(room)
      if (dbRoom) {
        await addUserToRoom(socket.user.id, room)
        socket.room = room
        socket.join(room)
        console.log(socket.user.name, ' joined room ', room)
        socket.emit('joined-room')
      }
    } catch (error) {
      console.log(error)
      socket.emit('error', 'The room you are trying to join does not exist!')
    }
  })
}

module.exports = socketServer
