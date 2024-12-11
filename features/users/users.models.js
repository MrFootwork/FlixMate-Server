const { Schema, model } = require('mongoose')
const userSchema = Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String, default: 'https://placehold.co/600x400?text=O' },
})
const User = model('User', userSchema)
module.exports = User
