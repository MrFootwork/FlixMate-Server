const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  try {
    //Check for cookies first because they are the lower priority
    if (req.cookies['bearer']) {
      req.token = req.cookies['bearer']
      console.log('Found Token in cookies ', req.token)
    }

    // Then we check for the auth header
    const authHeader = req.headers['authorization']
    if (authHeader) {
      const splitHeader = authHeader.split(' ')
      if (splitHeader[0] === 'Bearer' && splitHeader[1]) {
        const token = splitHeader[1]
        jwt.verify(token, require('../config').JWT_SECRET)
        req.token = splitHeader[1]
        console.log('Header ', authHeader, splitHeader)
        console.log('Found Token in header ', req.token)
      }
    }

    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'Please provide a valide token' })
  }
}

module.exports = authMiddleware
