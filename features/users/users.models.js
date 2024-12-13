const { Schema, model } = require('mongoose')

/**
 * @typedef {Object} User
 * @property {string} email - The user's email. Must be unique and is required.
 * @property {string} password - The user's password. Required.
 * @property {string} name - The user's full name. Required.
 * @property {string} [picture] - The user's profile picture URL. Defaults to a placeholder.
 */

/**
 * Mongoose schema for a user.
 * @type {Schema<User>}
 */
const userSchema = Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String, default: 'https://placehold.co/600x400?text=O' },
})

/**
 * Mongoose model for a user.
 * @type {import('mongoose').Model<User>}
 */
const User = model('User', userSchema)
module.exports = User
