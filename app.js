const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(morgan('dev'))
app.get('*', (_, res) => {
  res.send('Hello World!')
})
app.listen(require('./config').PORT, _ =>
  console.log('Listening on port: ', require('./config').PORT)
)
