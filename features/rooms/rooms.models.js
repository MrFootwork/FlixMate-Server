const { Schema, model } = require('mongoose')
const roomSchema = Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message', default: [] }],
  movie: {
    type: {
      title: String,
      id: String,
    },
  },
  participants: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    default: function () {
      return [this.owner]
    },
  },
  isPrivate: { type: Boolean, default: false },
  key: String,
})

const Room = model('Room', roomSchema)
module.exports = Room
