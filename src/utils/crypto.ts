import env from '@/config/env.config'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export const generateRandomToken = (length: number = 64): string => {
  return crypto.randomBytes(length).toString('hex')
}
export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN })
}

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN })
}

export const verifyAccessToken = (token: string): jwt.JwtPayload | string => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET)
  } catch (error) {
    throw new Error('Invalid access token')
  }
}

export const verifyRefreshToken = (token: string): jwt.JwtPayload | string => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET)
  } catch (error) {
    throw new Error('Invalid refresh token')
  }
}
