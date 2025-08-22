import express from 'express'
import ROUTE_PREFIX from '../constants/router-prefix'
import userRouter from './v1/users/router'

const routerV1 = express.Router()

routerV1.use(ROUTE_PREFIX.USERS, userRouter)

export default routerV1
