import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { THall, THallPolicies, THallSummary } from './hall.interface'

const hallPoliciesSchema = new Schema<THallPolicies>(
  {
    admissionCharge: { type: Number, default: 0 },
    maintenanceCharge: { type: Number, default: 0 },
    festivalCharge: { type: Number, default: 0 },
  },
  { _id: false },
)

const hallSummarySchema = new Schema<THallSummary>(
  {
    totalMaintenanceFee: { type: Number, default: 0 },
    dueMaintenanceFee: { type: Number, default: 0 },
    totalfestivalFee: { type: Number, default: 0 },
    dueFestivalFee: { type: Number, default: 0 },
  },
  { _id: false },
)

// Create a new Schema for Dining
const hallSchema = new Schema<THall>(
  {
    superAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'superAdmin',
      required: true,
    },
    hallName: {
      type: String,
      required: [true, 'Please provide a Name'],
      unique: true,
      trim: true,
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [100, 'Name is too large'],
    },

    phoneNumber: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      validate: {
        validator(value) {
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
    password: {
      type: String,
      validate: {
        validator: (value: string) =>
          validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        message: 'Password {VALUE} is not strong enough',
      },
    },

    address: {
      type: String,
      required: [true, 'Please provide a Address'],
      trim: true,
    },

    numberOfSeats: {
      type: Number,
      required: [true, 'Seats are required'],
      min: [1, 'There must be at least one seat'],
    },
    applicationStartDate: {
      type: Date,
    },
    applicationEndDate: {
      type: Date,
    },
    hallPolicies: hallPoliciesSchema,
    hallSummary: hallSummarySchema,
  },
  { timestamps: true },
)

hallSchema.pre('save', function (next) {
  if (!this.hallPolicies) {
    this.hallPolicies = {
      admissionCharge: 0,
      maintenanceCharge: 0,
      festivalCharge: 0,
    }
  }
  if (!this.hallSummary) {
    this.hallSummary = {
      totalMaintenanceFee: 0,
      dueMaintenanceFee: 0,
      totalfestivalFee: 0,
      dueFestivalFee: 0,
    }
  }
  next()
})

// Hash password before saving to database
hallSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = bcrypt.hashSync(this.password as string, 12)
  }
  next()
})

// Method to compare given password with stored password hash
hallSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password)
}

// Create Hall model
export const Hall = mongoose.model<THall>('Hall', hallSchema)
