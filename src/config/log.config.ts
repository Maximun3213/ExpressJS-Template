import STATUS_CODE from '@/constants/httpStatus'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import env from './env.config'

const PREFIX_LOG = '_logs/'
const LOG_DIR = path.join(__dirname, '..', PREFIX_LOG)

export const logAPI = (error: Error, request: Request, response: Response, _: NextFunction) => {
  const todayAsFileName = new Date().toISOString().split('T')[0]
  const url = request.originalUrl || request.url
  const method = request.method
  const status = request.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR
  const message = error.message || request.statusMessage || 'Unknown error'
  const stack = error.stack

  const log =
    `[${new Date().toISOString()}]\n` +
    `URL: ${url}\n` +
    `Method: ${method}\n` +
    `Status: ${status}\n` +
    `Message: ${message}\n` +
    `Stack: ${stack}\n` +
    `Body: ${JSON.stringify(request.body)} \n` +
    `Params: ${JSON.stringify(request.params)} \n` +
    `Query: ${JSON.stringify(request.query)} \n\n`

  fs.appendFile(LOG_DIR + todayAsFileName + '.log', log, (error) => {
    if (error) {
      console.error('Error writing log: ' + error.stack)
    }
  })

  response.status(status).json({
    status,
    message,
    stack: env.ENVIRONMENT === 'production' ? 'Internal error' : error.stack,
    data: null
  })
}
