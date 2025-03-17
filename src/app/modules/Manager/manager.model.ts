import mongoose, { Schema, model } from 'mongoose'
import { ManagerModel, TManager, TUserName } from './manager.interface'
import { BloodGroup, Gender } from './manager.constant'
import validator from 'validator'

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required'],
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
})

const managerSchema = new Schema<TManager, ManagerModel>(
  {
    creator: {
      type: String,
      required: [true, 'ID is required'],
      ref: 'User',
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hall',
      required: true,
    },
    dining: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dining',
      required: true,
    },
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: Date },
    contactNumber: {
      type: String,
      required: [true, 'Phone Number is required'],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      validate: {
        validator(value: any) {
          const phoneRegex = /^01\d{9}$/
          return phoneRegex.test(value)
        },
        message:
          'Invalid phone number format. It must be 11 digits and start with 01.',
      },
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
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloogGroup: {
      type: String,
      enum: {
        values: BloodGroup,
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImg: { type: String, default: '' },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
)

// generating full name
managerSchema.virtual('fullName').get(function () {
  return (
    this?.name?.firstName +
    ' ' +
    this?.name?.middleName +
    ' ' +
    this?.name?.lastName
  )
})

// filter out deleted documents
managerSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

managerSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

managerSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

//checking if user is already exist!
managerSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Manager.findOne({ id })
  return existingUser
}

export const Manager = model<TManager, ManagerModel>('Manager', managerSchema)
