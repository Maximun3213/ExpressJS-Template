import env from '@/config/env.config'
import STATUS_CODE from '@/constants/httpStatus'
import UserModel from '@/models/user.model'
import asyncHandler from '@/utils/asyncHandler'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/crypto'
import { validateEmail, validatePassword } from '@/utils/validate'
import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'

export default class userController {
  static getMe = asyncHandler(async (req: express.Request, res: express.Response) => {
    const user = req.body.user

    if (!user) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'Unauthorized', status: STATUS_CODE.UNAUTHORIZED })
    }

    return res
      .status(STATUS_CODE.OK)
      .json({ message: 'Get information successfully', status: STATUS_CODE.OK, data: user })
  })

  static login = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Email and password are required', status: STATUS_CODE.BAD_REQUEST })
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'User not found', status: STATUS_CODE.BAD_REQUEST })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Invalid password', status: STATUS_CODE.BAD_REQUEST })
    }

    const tokenPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    await UserModel.findByIdAndUpdate(user._id, { refreshToken })

    // Set new cookies for tokens
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      // sameSite: 'strict',
      sameSite: 'none',
      // path: '/',
      maxAge: 15 * 60 * 1000 // 15 minutes
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      // sameSite: 'strict',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return res.status(STATUS_CODE.OK).json({
      message: 'Login successful',
      status: STATUS_CODE.OK,
      data: {
        user: userData
        // accessToken,
        // refreshToken,
        // tokenType: 'Bearer',
        // expiresIn: env.JWT_ACCESS_EXPIRES_IN
      }
    })
  })

  static refreshToken = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Refresh token is required', status: STATUS_CODE.BAD_REQUEST })
    }

    try {
      const decoded = verifyRefreshToken(refreshToken) as jwt.JwtPayload

      const user = await UserModel.findOne({
        _id: decoded.id,
        refreshToken
      })

      if (!user) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: 'Invalid refresh token', status: STATUS_CODE.UNAUTHORIZED })
      }

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      const newAccessToken = generateAccessToken(userData)
      const newRefreshToken = generateRefreshToken(userData)

      await UserModel.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken })

      // Set new cookies for tokens
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: true,
        // sameSite: 'strict',
        // path: '/',
        sameSite: 'none',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        // sameSite: 'strict',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      return res.status(STATUS_CODE.OK).json({
        message: 'Tokens refreshed successfully',
        status: STATUS_CODE.OK,
        data: {
          userData
        }
      })
    } catch (error) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ message: 'Invalid or expired refresh token', status: STATUS_CODE.UNAUTHORIZED })
    }
  })

  static logout = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { refreshToken } = req.body
    const authHeader = req.headers.authorization
    const accessToken = authHeader && authHeader.split(' ')[1]

    if (!refreshToken && !accessToken) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Access token or refresh token is required', status: STATUS_CODE.BAD_REQUEST })
    }

    try {
      if (refreshToken) {
        const decoded = verifyRefreshToken(refreshToken) as jwt.JwtPayload
        await UserModel.findByIdAndUpdate(decoded.id, { refreshToken: null })
      }

      if (!refreshToken && accessToken) {
        const decoded = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as jwt.JwtPayload
        await UserModel.findByIdAndUpdate(decoded.id, { refreshToken: null })
      }

      // Clear cookies
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')

      return res.status(STATUS_CODE.OK).json({
        message: 'Logout successful',
        status: STATUS_CODE.OK
      })
    } catch (error) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'Invalid token', status: STATUS_CODE.UNAUTHORIZED })
    }
  })

  static register = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { name, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Password and rewrite password do not match', status: STATUS_CODE.BAD_REQUEST })
    }

    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Email already exists', status: STATUS_CODE.BAD_REQUEST })
    }

    try {
      validateEmail(email)
    } catch (error) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: (error as Error).message, status: STATUS_CODE.BAD_REQUEST })
    }

    try {
      validatePassword(password)
    } catch (error) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: (error as Error).message, status: STATUS_CODE.BAD_REQUEST })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await UserModel.create({ name, email, password: hashedPassword })

    if (!user) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'User not created', status: STATUS_CODE.BAD_REQUEST })
    }

    return res.status(STATUS_CODE.CREATED).json({ message: 'Sign up successful!', status: STATUS_CODE.CREATED })
  })

  static findUsersByName = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { name } = req.query
    const { userId } = req.body
    const limit = 10
    try {
      // Decode JWT to get current user ID
      // const decoded = verifyAccessToken(req.cookies.accessToken) as jwt.JwtPayload
      // const currentUserId = decoded.id

      // if (!currentUserId) {
      //   return res.status(STATUS_CODE.UNAUTHORIZED).json({
      //     message: 'Invalid access token',
      //     status: STATUS_CODE.UNAUTHORIZED
      //   })
      // }

      let users

      if (name && typeof name === 'string') {
        // Search users by name with case-insensitive regex, excluding current user
        users = await UserModel.find({
          _id: { $ne: userId },
          name: { $regex: name, $options: 'i' }
        }).limit(limit)
      } else {
        // Return first 10 users excluding current user if no name provided
        users = await UserModel.find({
          _id: { $ne: userId }
        }).limit(limit)
      }

      return res.status(STATUS_CODE.OK).json({
        message: 'Get users successfully',
        status: STATUS_CODE.OK,
        data: users,
        count: users.length
      })
    } catch (error) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to retrieve users',
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })
}
