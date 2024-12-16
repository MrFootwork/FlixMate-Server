const Message = require('./messages.models')
const Room = require('../rooms/rooms.models')

async function createMessage(text, senderId, roomId) {
  try {
    const message = await Message.create({ text, senderId })
    const room = await Room.findById(roomId).exec()
    room.messages.push(message)
    await room.save()
  } catch (error) {
    throw error
  }
}

async function deleteMessageById(messageId) {
  try {
    await Message.deleteOne({ _id: messageId })
    const message = await Message.findById(messageId).exec()
    if (message) {
      throw new Error('Message not found')
    }
  } catch (error) {
    throw error
  }
}

async function updateMessageById(messageId, text) {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { text },
      { new: true }
    )
    return updatedMessage
  } catch (error) {
    throw error
  }
}

module.exports = {
  createMessage,
  deleteMessageById,
  updateMessageById,
}
