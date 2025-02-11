import { model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { TUser, UserModel } from './user.interface'
import config from '../../config'
import { USER_STATUS } from './user.constant'

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      requered: true,
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email type',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
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
      enum: USER_STATUS,
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

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  const isUserExists = await User.findOne({ id }).select('+password')
  return isUserExists
}

userSchema.statics.isPasswordMatched = async function (
  plainPass: string,
  hashedPass,
) {
  const isPasswordMatched = await bcrypt.compare(plainPass, hashedPass)
  return isPasswordMatched
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAtTime: Date,
  jwtIssuedTime: number,
) {
  const passwordChangedTime = new Date(passwordChangedAtTime).getTime() / 1000
  return passwordChangedTime > jwtIssuedTime
}

const User = model<TUser, UserModel>('User', userSchema)

export default User
