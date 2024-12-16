const Room = require('./rooms.models')
const { ObjectId } = require('mongoose')

async function getRooms() {
  return await Room.find({}, { key: 0 }).populate([
    {
      path: 'participants',
      select: '-password',
    },
    {
      path: 'owner',
      select: '-password',
    },
  ])
}

async function getRoombyId(roomId) {
  try {
    return await Room.findById(roomId, { key: 0 }).populate({
      path: 'participants',
      select: '-password',
    })
  } catch (error) {
    throw error
  }
}

async function createRoom(room) {
  try {
    return await Room.create(room)
  } catch (error) {
    throw error
  }
}

async function deleteRoomById(roomId) {
  try {
    return await Room.deleteOne({ _id: roomId })
  } catch (error) {
    throw error
  }
}

async function addUserToRoom(userId, roomId) {
  try {
    const room = await Room.findById(roomId)
    if (!room.participants.includes(userId)) {
      return await Room.updateOne(
        { _id: roomId },
        { $push: { participants: userId } }
      )
    }
  } catch (error) {
    throw error
  }
}

async function removeUserFromRoom(userId, roomId) {
  try {
    const room = await Room.findById(roomId)
    await room.participants.remove(userId)
    await room.save()
    return room
  } catch (error) {
    throw error
  }
}

async function changeRoomMovie(movie, roomId) {
  try {
    return await Room.updateOne({ _id: roomId }, { movie: movie })
  } catch (error) {
    throw error
  }
}

module.exports.getRooms = getRooms
module.exports.getRoombyId = getRoombyId
module.exports.createRoom = createRoom
module.exports.deleteRoomById = deleteRoomById
module.exports.addUserToRoom = addUserToRoom
module.exports.removeUserFromRoom = removeUserFromRoom
module.exports.changeRoomMovie = changeRoomMovie
