const mongoose = require('mongoose')
require('./users/users.models')

console.log(require('../config').DB_URL)

const URI = `mongodb+srv://FlixMateMaster:${require('../config').DB_PASSWORD}${
  require('../config').DB_URL
}`

mongoose
  .connect(URI)
  .then(_ => console.log('Mongoose connected to: ', mongoose.connection.host))
