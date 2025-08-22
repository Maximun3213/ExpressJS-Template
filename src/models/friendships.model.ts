import mongoose, { Document } from 'mongoose'

export interface IFriendship extends Document {
  id: string
  user1: string
  user2: string
  status: FriendshipStatus
  requestedBy: string
  createdAt: Date
  updatedAt: Date
}

export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

const friendshipSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(FriendshipStatus),
    default: FriendshipStatus.PENDING
  }
})

const FriendshipModel = mongoose.model<IFriendship>('Friendships', friendshipSchema)

export default FriendshipModel
