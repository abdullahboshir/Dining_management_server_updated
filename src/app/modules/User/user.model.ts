import { model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { TUser } from './user.interface'
import config from '../../config'

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      requered: true,
      unique: true,
      index: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'manager', 'student', 'moderator'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
      set: (value: string) => value.toLowerCase(),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

userSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

// Define a method to compare the password with the hashed password
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

const User = model<TUser>('User', userSchema)

export default User
