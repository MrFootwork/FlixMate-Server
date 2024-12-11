function authMiddleware(req, _, next) {
  //Check for cookies first because they are the lower priority
  if (req.cookies['bearer']) {
    req.token = req.cookies['bearer']
    console.log('Found Token in cookies')
  }

  // Then we check for the auth header
  const authHeader = req.headers['authorization']
  if (authHeader) {
    const splitHeader = authHeader.split(' ')
    if (splitHeader[0] === 'Bearer' && splitHeader[1]) {
      req.token = splitHeader[1]
      console.log('Found Token in header')
    }
  }

  next()
}

module.exports = authMiddleware
