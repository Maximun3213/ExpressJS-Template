import UsersController from '@/apis/v1/controllers/users.controller'
import { authenticateToken } from '@/middlewares/users.middlewares'
import express from 'express'

const userRouter = express.Router()

userRouter.get('/me', authenticateToken, UsersController.getMe)

userRouter.post('/login', UsersController.login)

export default userRouter
