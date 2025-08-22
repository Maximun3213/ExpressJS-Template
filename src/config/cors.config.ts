import AUTH from '@/constants/auth'
import cors from 'cors'
import env from './env.config'

const corsConfig = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    const allowedOrigins =
      env.ENVIRONMENT === 'production' ? ['http://localhost:3000', env.CLIENT_URL] : ['http://localhost:3000']

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (env.ENVIRONMENT !== 'production') {
      const ipPattern =
        /^https?:\/\/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):8080$/
      const localhostPattern = /^https?:\/\/localhost:\d+$/
      const localIpPattern =
        /^https?:\/\/(?:127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+):\d+$/

      if (ipPattern.test(origin) || localhostPattern.test(origin) || localIpPattern.test(origin)) {
        return callback(null, true)
      }
    }

    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  exposedHeaders: ['Set-Cookie', AUTH.ACCESS_TOKEN_HEADER, AUTH.REFRESH_TOKEN_HEADER]
})

export default corsConfig
