const router = require('express').Router()
const usersRoutes = require('./users/users.routes')

router.use(usersRoutes)

module.exports = router
