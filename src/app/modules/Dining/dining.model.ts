import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { TDining } from './dining.interface'

// Create a new Schema for Dining
const diningSchema = new Schema<TDining>(
  {
    superAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'superAdmin',
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
    diningName: {
      type: String,
      required: [true, 'Please provide a Name'],
      trim: true,
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [100, 'Name is too large'],
    },
    divisionValue: {
      type: String,
      required: [true, 'Division is required'],
    },
    districtValue: {
      type: String,
      required: [true, 'District is required'],
    },
    subDistrictValue: {
      type: String,
      required: [true, 'Sub-district is required'],
    },
    allianceValue: {
      type: String,
      required: [true, 'Alliance is required'],
    },
    seatsNumber: {
      type: Number,
      required: [true, 'Seats are required'],
      min: [1, 'There must be at least one seat'],
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
    applicationStartDate: {
      type: String,
    },
    applicationEndDate: {
      type: String,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Hash password before saving to database
diningSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = bcrypt.hashSync(this.password as string, 12)
  }
  next()
})

// Method to compare given password with stored password hash
diningSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password)
}

// Create Dining model
export const Dining = mongoose.model<TDining>('Dining', diningSchema)
