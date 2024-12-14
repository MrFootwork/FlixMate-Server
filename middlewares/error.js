function errorMiddleware(error, req, res, next) {
  console.error('Error in route:', req.path, error)

  if (error.cause === 'no-cookie') {
    return res.status(403).json({ message: error.message })
  }

  if (error.cause === 'no-user') {
    return res.status(404).json({ message: error.message })
  }

  res
    .status(500)
    .json({ message: 'An unkown internal server error occurred. 🔥🔥🔥' })
  next()
}

module.exports = errorMiddleware
