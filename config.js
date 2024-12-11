require('dotenv').config()

module.exports.PORT = process.env.PORT || 5005
module.exports.DB_PASSWORD = process.env.DB_PASSWORD || ''
module.exports.JWT_SECRET = process.env.JWT_SECRET || ''
