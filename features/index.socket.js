const http = require('http')
const { getUserFromJWT } = require('./users/users.services')
const {
  getRoombyId,
  addUserToRoom,
  removeUserFromRoom,
} = require('./rooms/rooms.services')
const { createMessage } = require('./messages/messages.services')

function socketServer(app) {
  const server = http.createServer(app)

  /** @type {import('socket.io').Server} */
  const io = require('socket.io')(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'https://flixmate-client.onrender.com',
        'https://www.netflix.com',
      ],
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
    addListenersToSocket(socket, io)
  })

  return server
}

/**
 * Adds all declared listeners to the socket.
 * @param {import('socket.io').Socket} socket - The socket instance.
 */
function addListenersToSocket(socket, io) {
  socket.on('join-room', async room => {
    try {
      const dbRoom = await getRoombyId(room)
      // setTimeout(() => {
      //   io.to(socket.room).emit('netflix-send', {
      //     eventType: 'seeked',
      //     videoTime: '',
      //     eventUser: socket.user,
      //   })
      // }, 20000)

      if (dbRoom) {
        await addUserToRoom(socket.user.id, room)
        socket.room = room
        socket.type = 'Show'
        socket.join(room)
        console.log(socket.user.name, ' joined room ', room)
        socket.emit('joined-room')
      }
    } catch (error) {
      console.log(error)
      socket.emit('error', 'The room you are trying to join does not exist!')
    }

    // Listen for events in the room
    socket.on('netflix', async data => {
      console.log('Video data from Netflix: ', data)
      console.log('SOCKET: ', socket.rooms, socket.room)

      const eventType = data.type
      const user = socket.user
      // const roomId = socket.room
      const videoTime = data.videoTime

      try {
        io.to(socket.room).emit('netflix-send', {
          eventType,
          videoTime,
          eventUser: user,
        })
      } catch (error) {
        console.log(error)
        socket.emit('error', "The video player event couldn't be processed.")
      }
    })
  })

  socket.on('join-chat', async room => {
    try {
      const dbRoom = await getRoombyId(room)
      // setTimeout(() => {
      //   io.to(socket.room).emit('netflix-send', {
      //     eventType: 'seeked',
      //     videoTime: '',
      //     eventUser: socket.user,
      //   })
      // }, 20000)

      if (dbRoom) {
        // await addUserToRoom(socket.user.id, room)
        socket.room = room
        socket.type = 'Chat'
        socket.join(room)
        console.log(socket.user.name, ' joined room ', room)
        socket.emit('joined-room')
      }
    } catch (error) {
      console.log(error)
      socket.emit('error', 'The room you are trying to join does not exist!')
    }
  })

  socket.on('receive-message', message => {
    try {
      if (!message) return
      handleMessageReceived(io, socket.room, message, socket.user)
    } catch (error) {
      console.log(error)
      socket.emit('error', error)
    }
  })

  socket.on('disconnect', async _ => {
    try {
      if (socket.room) {
        console.log(`${socket.user.name} disconnected from room ${socket.room}`)
        const dbRoom = await getRoombyId(socket.room)
        if (dbRoom) {
          const roomSockets = await io.in(socket.room).fetchSockets()

          const sameUserSockets = roomSockets.filter(
            msocket => msocket.user.email === socket.user.email
          )
          console.log(sameUserSockets.length)
          if (sameUserSockets.length === 0)
            removeUserFromRoom(socket.user.id, socket.room)
        }
      }
    } catch (error) {
      console.log('Disconnect Error: ', error)
    }
  })
}

function broadcastMessage(socket, room, message, io) {
  console.log('Brodcasting message: ', message, ' to room: ', room)
  socket.to(room).emit('new-message', message)
}

async function handleMessageReceived(socket, room, text, senderId) {
  const message = await createMessage(text, senderId, room)
  broadcastMessage(socket, room, message)
}

module.exports = socketServer
