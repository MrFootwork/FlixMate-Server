const protected = require('../../middlewares/protected')

const userRouter = require('express').Router()
const authRouter = require('express').Router()
const router = require('express').Router()

const cookieOptions = require('./users.config')

const {
  checkPasswordMatch,
  createJWTFromUser,
  getUserFromJWT,
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
} = require('./users.services')

authRouter.post('/signup', async (req, res, next) => {
  try {
    console.log(req.body)
    await createUser(req.body)
    res.status(201).json({ message: 'User created' })
  } catch (error) {
    next(error)
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.email)
    if (!user) throw Error(`🔐🔐 Wrong Credentials 🙅‍♂️🙅‍♀️`, { cause: 'no-user' })

    if (await checkPasswordMatch(req.body.password, user._id)) {
      const token = await createJWTFromUser(user)
      res.cookie('bearer', token, cookieOptions.set)
      res.status(200).json({ jwt: token })
      return
    }
    res.status(401).json({ message: 'Email or Password is incorrect' })
  } catch (error) {
    next(error)
  }
})

authRouter.get('/refresh-token', async (req, res, next) => {
  try {
    if (!(req.token || req.userId)) {
      throw Error(
        `The route "${req.originalUrl}" requires a valid token. 🍪🍪🍪`,
        { cause: 'no-cookie' }
      )
    }

    const user = await getUserById(req.userId)
    const token = await createJWTFromUser(user)

    res.cookie('bearer', token, cookieOptions.set)
    res.status(200).json({ jwt: token })
    return
  } catch (error) {
    next(error)
  }
})

authRouter.post('/logout', (_, res) => {
  res.clearCookie('bearer', cookieOptions.clear)
  res.status(200).json({ message: 'Succesfully disconnected' })
})

userRouter.get('/', async (_, res) => {
  res.status(200).json(await getUsers())
})

userRouter.get('/me', async (req, res) => {
  const user = await getUserFromJWT(req.token)
  res.status(200).json(user)
})

userRouter.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await getUserById(userId)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
})

userRouter.put('/:userId', async (req, res, next) => {
  const { userId } = req.params
  const update = req.body

  try {
    const user = await updateUserById(userId, update)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
})

userRouter.delete('/:userId', async (req, res, next) => {
  const { userId } = req.params

  try {
    const user = await deleteUserById(userId)
    console.log(`🚀 ~ userRouter.delete ~ user:`, user)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
})

router.use('/users', protected, userRouter)
router.use('/auth', authRouter)
module.exports = router
