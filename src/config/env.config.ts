import dotenv from 'dotenv'

dotenv.config()

const env = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  CLIENT_URL: process.env.CLIENT_URL,
  // DATABASE
  USERNAME_DB: process.env.USER_DB_USERNAME || '',
  PASSWORD_DB: process.env.USER_DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || '',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  PORT: Number(process.env.PORT) || 4000,
  URL_CONNECT_DB: `mongodb+srv://${process.env.USER_DB_USERNAME}:${process.env.USER_DB_PASSWORD}@chat-dataset.62byx.mongodb.net/?retryWrites=true&w=majority&appName=chat-dataset`
}

export default env
