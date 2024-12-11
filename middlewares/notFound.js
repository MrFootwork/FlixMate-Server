function notFoundMiddleware(req, res, next) {
  if (!req.route) {
    res.status(404)
    return
  }
  next()
}

module.exports = notFoundMiddleware
