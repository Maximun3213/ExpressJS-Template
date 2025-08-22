import env from '@/config/env.config'
import STATUS_CODE from '@/constants/httpStatus'
import UserModel, { IUser } from '@/models/user.model'
import asyncHandler from '@/utils/asyncHandler'
import { verifyAccessToken } from '@/utils/crypto'
import express, { NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authenticateToken = asyncHandler(
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const accessToken = req.cookies?.accessToken

    if (!accessToken) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        message: 'Access token is required',
        status: STATUS_CODE.UNAUTHORIZED
      })
    }

    try {
      const decoded = verifyAccessToken(accessToken) as IUser

      const user = await UserModel.findById(decoded.id).select('-password -refreshToken')

      if (!user) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: 'User not found', status: STATUS_CODE.UNAUTHORIZED })
      }

      req.body.user = user
      req.body.userId = user._id
      req.body.userRole = user.role

      next()
    } catch (error) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ message: 'Invalid or expired access token', status: STATUS_CODE.UNAUTHORIZED })
    }
  }
)

export const requireRole = (roles: string[]) => {
  return asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userRole = req.body.userRole

    if (!userRole || !roles.includes(userRole)) {
      return res
        .status(STATUS_CODE.FORBIDDEN)
        .json({ message: 'Insufficient permissions', status: STATUS_CODE.FORBIDDEN })
    }

    next()
  })
}

export const JwtAuthMiddleWare = (req: express.Request, res: express.Response, next: NextFunction) => {
  const token: string = req.cookies.accessToken
  console.log('res', res)
  try {
    if (!token) {
      throw {
        status: 403,
        message: 'User not authorized'
      }
    }

    jwt.verify(token, env.JWT_ACCESS_SECRET!, (err, user) => {
      if (err) throw { status: 403, message: 'Verification failed' }
      req.body.user = user
      next()
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}
