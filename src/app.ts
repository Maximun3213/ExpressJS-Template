import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import http from 'http'
import morgan from 'morgan'
import routerV1 from './apis/router'
import env from './config/env.config'
import { logAPI } from './config/log.config'
import AUTH from './constants/auth'
import STATUS_CODE from './constants/httpStatus'

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(
  cors({
    origin: env.ENVIRONMENT === 'production' ? ['http://localhost:3001', env.CLIENT_URL] : 'http://localhost:3001',
    credentials: true,
    exposedHeaders: ['Set-Cookie', AUTH.ACCESS_TOKEN_HEADER, AUTH.REFRESH_TOKEN_HEADER]
  })
)

app.use(bodyParser.json())

app.use(helmet())

app.use(morgan('dev'))

app.use('/api', routerV1)

app.use((_: Request, response: Response, next: NextFunction) => {
  const error = new Error('URL is not exist')

  response.status(STATUS_CODE.NOT_FOUND)

  next(error)
})

app.use(logAPI)

const index = new http.Server(app)

export default index
