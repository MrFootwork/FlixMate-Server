const express = require('express')
const logger = require('./utils/logger')

const app = express()
app.use(logger)
app.get('*', (_, res) => {
  res.send('Hello World!')
})
app.listen(require('./config').PORT, _ =>
  console.log('Listening on port: ', require('./config').PORT)
)
