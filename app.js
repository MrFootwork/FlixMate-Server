const express = require('express')
const logger = require('./utils/logger')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const _ = require('./features/index.models')
const authMiddleware = require('./middlewares/auth')
const errorMiddleware = require('./middlewares/error')
const notFoundMiddleware = require('./middlewares/notFound')
const router = require('./features/index.routes')

const app = express()
app.use(logger)
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://flixmate-client.onrender.com'],
    credentials: true,
  })
)
app.use(bodyParser.json())
app.use(cookieParser())
app.use(authMiddleware)
app.use(router)
// app.use(notFoundMiddleware)
app.use(errorMiddleware)
app.listen(require('./config').PORT, _ =>
  console.log('Listening on port: ', require('./config').PORT)
)
