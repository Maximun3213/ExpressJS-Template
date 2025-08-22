import express from 'express'
import ROUTE_PREFIX from '../constants/router-prefix'
import userRouter from './v1/routes/users.route'

const routerV1 = express.Router()

routerV1.use(ROUTE_PREFIX.USERS, userRouter)

export default routerV1
