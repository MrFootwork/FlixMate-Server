const mongoose = require('mongoose')
require('./users/users.models')

const URI = `mongodb+srv://FlixMateMaster:${
  require('../config').DB_PASSWORD
}@flixmate.wpabc.mongodb.net/FlixMate?retryWrites=true&w=majority&appName=FlixMate`

mongoose
  .connect(URI)
  .then(_ => console.log('Mongoose connected to: ', mongoose.connection.host))
