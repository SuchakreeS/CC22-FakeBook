import express from 'express'
import { getMe, login, register } from '../controllers/auth.controller.js'
import authenticate from '../middlewares/authenticate.middleware.js'
const authRoute = express.Router()

authRoute.post('/register', register)
authRoute.post('/login', login)
authRoute.get('/me',authenticate, getMe)

export default authRoute