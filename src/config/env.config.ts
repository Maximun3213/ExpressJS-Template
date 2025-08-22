import dotenv from 'dotenv'

dotenv.config()

const env = {
  //GLOBAL
  ENVIRONMENT: process.env.ENVIRONMENT,
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: Number(process.env.PORT) || 4000,

  // DATABASE
  USERNAME_DB: process.env.USER_DB_USERNAME || '',
  PASSWORD_DB: process.env.USER_DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',
  URL_CONNECT_DB: `mongodb+srv://${process.env.USER_DB_USERNAME}:${process.env.USER_DB_PASSWORD}@chat-dataset.62byx.mongodb.net/?retryWrites=true&w=majority&appName=chat-dataset`,

  //JWT
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || '',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
}

export default env
