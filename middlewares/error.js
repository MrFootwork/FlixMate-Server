function errorMiddleware(error, req, res, next) {
  console.error('Error in route:', req.path, error)

  if (error.cause === 'no-cookie') {
    return res.status(403).json({ message: error.message })
  }

  res.status(500).json({ message: 'Internal server error' })
  next()
}

module.exports = errorMiddleware
