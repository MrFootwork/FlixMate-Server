function errorMiddleware(error, req, res, next) {
  res.status(500).json({ message: 'Internal server error' })
  console.log('Error in route:', req.path, error)
  next()
}

module.exports = errorMiddleware
