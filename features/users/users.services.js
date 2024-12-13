const User = require('./users.models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = require('../../config').JWT_SECRET

function hashUserPassword(user) {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(user.password, salt)
  user.password = hash
  return user
}

async function checkPasswordMatch(password, userId) {
  try {
    const user = await User.findById(userId)
    console.log(password, user.password)
    return bcrypt.compareSync(password, user.password)
  } catch (error) {
    throw error
  }
}

async function createJWTFromUser(user) {
  const userPayload = {
    _id: user._id,
    name: user.name,
    picture: user.picture,
  }
  return jwt.sign(userPayload, JWT_SECRET)
}

async function getUserFromJWT(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded._id, { password: 0 })
    return user
  } catch (error) {
    throw error
  }
}

async function createUser(user) {
  try {
    user = hashUserPassword(user)
    await User.create(user)
    return
  } catch (error) {
    throw error
  }
}

async function getUsers() {
  return await User.find({}, { password: 0 })
}

async function getUserById(userId) {
  try {
    const user = await User.findById(userId, { password: 0 })
    return user
  } catch (error) {
    throw error
  }
}

async function updateUserById(userId, update) {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      returnDocument: 'after',
    }).lean()

    delete updatedUser.password

    return updatedUser
  } catch (error) {
    throw error
  }
}

async function deleteUserById(userId) {
  try {
    const user = await User.findByIdAndDelete(userId).lean()
    delete user.password
    return user
  } catch (error) {
    throw error
  }
}

async function getUserByEmail(userEmail) {
  try {
    const user = await User.findOne({ email: userEmail }, { password: 0 })
    return user
  } catch (error) {
    throw error
  }
}

module.exports.checkPasswordMatch = checkPasswordMatch
module.exports.createJWTFromUser = createJWTFromUser
module.exports.getUserFromJWT = getUserFromJWT
module.exports.getUsers = getUsers
module.exports.createUser = createUser
module.exports.getUserById = getUserById
module.exports.updateUserById = updateUserById
module.exports.deleteUserById = deleteUserById
module.exports.getUserByEmail = getUserByEmail
