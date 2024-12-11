function protected(req, res, next) {
  if (!req.token)
    return res
      .status(401)
      .json({ message: 'You need to log in to access this route' })

  next()
}

module.exports = protected
