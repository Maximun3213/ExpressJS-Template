import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import http from 'http'
import morgan from 'morgan'
import routerV1 from './apis/router'
import corsConfig from './config/cors.config'
import env from './config/env.config'
import { logAPI } from './config/log.config'
import swaggerDocs from './config/swagger.config'
import STATUS_CODE from './constants/httpStatus'

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(corsConfig)

app.use(bodyParser.json())

app.use(helmet())

app.use(morgan('dev'))

app.use('/api', routerV1)

swaggerDocs(app, env.PORT)

app.use((_: Request, response: Response, next: NextFunction) => {
  const error = new Error('URL is not exist')

  response.status(STATUS_CODE.NOT_FOUND)

  next(error)
})

app.use(logAPI)

const index = new http.Server(app)

export default index
