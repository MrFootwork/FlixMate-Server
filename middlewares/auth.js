const jwt = require('jsonwebtoken')

// Adds token and userId to request, if cookie or authorization header is provided
function authMiddleware(req, res, next) {
  let token = null
  let userId = null

  try {
    //Check for cookies first because they are the lower priority
    if (req.cookies['bearer']) {
      token = req.cookies['bearer']
      // console.log('🍪 Found Token in cookies ', token)
    }

    // Then we check for the auth header
    const authHeader = req.headers['authorization']
    if (authHeader) {
      const splitHeader = authHeader.split(' ')

      if (splitHeader[0] === 'Bearer' && splitHeader[1]) {
        token = splitHeader[1]
        // console.log('🍪 Header ', authHeader, splitHeader)
        // console.log('🍪 Found Token in header ', token)
      }
    }

    // The header token takes presedence over the cookie token, if both exist.
    if (token) userId = jwt.verify(token, require('../config').JWT_SECRET)._id

    req.token = token
    req.userId = userId

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authMiddleware
