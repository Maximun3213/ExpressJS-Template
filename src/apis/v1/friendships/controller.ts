import STATUS_CODE from '@/constants/httpStatus'
import FriendshipModel, { FriendshipStatus } from '@/models/friendships.model'
import UserModel from '@/models/user.model'
import asyncHandler from '@/utils/asyncHandler'
import express from 'express'
import mongoose from 'mongoose'

export default class friendshipController {
  static getListFriendships = asyncHandler(async (req: express.Request, res: express.Response) => {
    const user = req.body.user

    // Check if user is authenticated
    if (!user) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        message: 'Unauthorized - User not authenticated',
        status: STATUS_CODE.UNAUTHORIZED
      })
    }

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        message: 'Invalid user ID format',
        status: STATUS_CODE.BAD_REQUEST
      })
    }

    try {
      // Get friendships where user is either user1 or user2
      const friendships = await FriendshipModel.find({
        $or: [{ user1: user._id }, { user2: user._id }]
      })
        .populate('user1', 'name email')
        .populate('user2', 'name email')

      return res.status(STATUS_CODE.OK).json({
        message: 'Get friendships successfully',
        status: STATUS_CODE.OK,
        data: friendships,
        count: friendships.length
      })
    } catch (error) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to retrieve friendships',
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })

  static createFriendship = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { user1, user2 } = req.body
    const currentUser = req.body.user

    // Check if user is authenticated
    if (!currentUser) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        message: 'Unauthorized - User not authenticated',
        status: STATUS_CODE.UNAUTHORIZED
      })
    }

    // Validate required fields
    if (!user1 || !user2) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        message: 'Both user1 and user2 are required',
        status: STATUS_CODE.BAD_REQUEST
      })
    }

    // Validate user ID formats
    if (!mongoose.Types.ObjectId.isValid(user1) || !mongoose.Types.ObjectId.isValid(user2)) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        message: 'Invalid user ID format',
        status: STATUS_CODE.BAD_REQUEST
      })
    }

    // Prevent self-friendship
    if (user1 === user2) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        message: 'Users cannot send friend request to themselves',
        status: STATUS_CODE.BAD_REQUEST
      })
    }

    // Check if current user is authorized to create this friendship
    if (currentUser._id.toString() !== user1.toString()) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        message: 'You can only send friend requests from your own account',
        status: STATUS_CODE.FORBIDDEN
      })
    }

    try {
      // Check if both users exist
      const [userOne, userTwo] = await Promise.all([UserModel.findById(user1), UserModel.findById(user2)])

      if (!userOne) {
        return res.status(STATUS_CODE.NOT_FOUND).json({
          message: 'User1 not found',
          status: STATUS_CODE.NOT_FOUND
        })
      }

      if (!userTwo) {
        return res.status(STATUS_CODE.NOT_FOUND).json({
          message: 'User2 not found',
          status: STATUS_CODE.NOT_FOUND
        })
      }

      // Check if friendship already exists (in either direction)
      const existingFriendship = await FriendshipModel.findOne({
        $or: [
          { user1: user1, user2: user2 },
          { user1: user2, user2: user1 }
        ]
      })

      if (existingFriendship) {
        const status = existingFriendship.status
        let message = ''

        switch (status) {
          case FriendshipStatus.PENDING:
            message = 'Friend request already sent and pending'
            break
          case FriendshipStatus.ACCEPTED:
            message = 'Users are already friends'
            break
          case FriendshipStatus.REJECTED:
            message = 'Friend request was previously rejected'
            break
          default:
            message = 'Friendship relationship already exists'
        }

        return res.status(STATUS_CODE.CONFLICT).json({
          message,
          status: STATUS_CODE.CONFLICT,
          existingStatus: status
        })
      }

      // Create new friendship
      const friendship = await FriendshipModel.create({
        user1: user1,
        user2: user2,
        status: FriendshipStatus.PENDING,
        requestedBy: currentUser._id
      })

      // Populate user details in response
      const populatedFriendship = await FriendshipModel.findById(friendship._id)
        .populate('user1', 'name email')
        .populate('user2', 'name email')

      return res.status(STATUS_CODE.CREATED).json({
        message: 'Friend request sent successfully',
        status: STATUS_CODE.CREATED,
        data: populatedFriendship
      })
    } catch (error) {
      // Handle duplicate key error
      if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
        return res.status(STATUS_CODE.CONFLICT).json({
          message: 'Friendship already exists',
          status: STATUS_CODE.CONFLICT
        })
      }

      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create friendship',
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })
}
