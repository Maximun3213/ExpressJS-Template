import { validateEmail, validatePassword } from '@/utils/validate'
import mongoose, { Document, Model } from 'mongoose'
// import { roles } from '../config/roles'
// import { paginate, toJSON } from './plugins'

// Define the User interface
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

// Define static methods interface
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
      private: true // used by the toJSON plugin
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
      //   enum: roles,
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

// add plugin that converts mongoose to json
// userSchema.plugin(toJSON)
// userSchema.plugin(paginate)

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
  return !!user
}

// userSchema.methods.isPasswordMatch = async function (password) {
//   const user = this
//   return bcrypt.compare(password, user.password)
// }

// userSchema.pre('save', async function (next) {
//   const user = this
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8)
//   }
//   next()
// })

const UserModel = mongoose.model<IUser, IUserModel>('Users', userSchema)

export default UserModel
