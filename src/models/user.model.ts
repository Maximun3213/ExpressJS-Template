import { validateEmail, validatePassword } from '@/utils/validate'
import mongoose, { Document, Model } from 'mongoose'

export interface IUser extends Document {
  id: string
  name: string
  email: string
  password: string
  avatar: string
  refreshToken?: string | null
  role: string
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IUserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        validateEmail(value)
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        validatePassword(value)
      },
      private: true
    },
    avatar: {
      type: String,
      default: null
    },
    refreshToken: {
      type: String,
      default: null
    },
    role: {
      type: String,
      default: 'user'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
  return !!user
}

const UserModel = mongoose.model<IUser, IUserModel>('Users', userSchema)

export default UserModel
