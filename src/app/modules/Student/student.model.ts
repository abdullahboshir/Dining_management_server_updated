import mongoose, { Schema } from 'mongoose'
import validator from 'validator'
import { TAddress, TGuardian, TStudent } from './student.interface'

// Guardian Subdocument Schema
const guardianSchema = new Schema<TGuardian>(
  {
    fatherName: { type: String, required: true, trim: true },
    fatherOccupation: { type: String, required: true, trim: true },
    fatherContactNo: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    motherOccupation: { type: String, required: true, trim: true },
    motherContactNo: { type: String, required: true, trim: true },
  },
  { _id: false },
)

// Address Subdocument Schema
const addressSchema = new Schema<TAddress>(
  {
    division: { type: String, required: true },
    district: { type: String, required: true },
    subDistrict: { type: String, required: true },
    alliance: { type: String, required: true },
    village: { type: String, required: true },
  },
  { _id: false },
)

// Main Student Schema
const studentSchema = new Schema<TStudent>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
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
      unique: true,
      required: [true, 'Please provide a Student ID'],
      index: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: [true, 'User id is required'],
    },
    studentPin: {
      type: String,
      required: true,
      index: true,
      trim: true,
      default: function () {
        return Math.floor(10000 + Math.random() * 90000).toString() // Default 5-digit PIN
      },
      validate: {
        validator: function (value: string) {
          return /^[0-9]{5}$/.test(value)
        },
        message: 'The Student PIN must contain exactly 5 digits.',
      },
    },
    name: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      middleName: { type: String, trim: true },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'other'],
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone Number is required'],
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
    roomNumber: {
      type: Number,
      required: [true, 'Room Number is required'],
      validate: {
        validator: function (value: number) {
          return /^[0-9]{3}$/.test(value.toString())
        },
        message: 'The room number must contain exactly 3 digits.',
      },
    },
    seatNumber: {
      type: Number,
      required: [true, 'Seat Number is required'],
      validate: {
        validator: function (value: number) {
          return /^[0-9]{1}$/.test(value.toString())
        },
        message: 'The Seat number must contain exactly 1 digits.',
      },
    },
    academicFaculty: {
      type: String,
      required: true,
      trim: true,
    },
    academicDepartment: {
      type: String,
      required: true,
      trim: true,
    },
    session: {
      type: String,
      required: [true, 'Please provide a Session of Student'],
      trim: true,
    },
    classRoll: {
      type: Number,
      required: [true, 'Please provide Your Class roll'],
      trim: true,
    },
    admissionHistory: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      paymentMethod: {
        type: String,
        required: true,
        trim: true,
        default: 'cash',
      },
      paymentStatus: {
        type: Boolean,
        required: true,
        default: false,
      },
      date: {
        type: Date,
        required: true,
      }
    },
    emergencyContact: {
      type: String,
      required: [true, 'Emergency Contact Number is required'],
    },
    profileImg: {
      type: String,
      default: '',
    },
    guardian: {
      type: guardianSchema,
      required: true,
      default: {},
    },
    presentAddress: {
      type: addressSchema,
      required: true,
      default: {},
    },
    permanentAddress: {
      type: addressSchema,
      required: true,
      default: {},
    },
    meals: {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
      required: false,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)

const capitalize = (str: string = '') =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

studentSchema.pre('save', function (next) {
  try {
    this.name.firstName &&= capitalize(this.name.firstName)
    this.name.middleName &&= capitalize(this.name.middleName)
    this.name.lastName &&= capitalize(this.name.lastName)
    next()
  } catch (error: any) {
    next(error)
  }
})

// generating full name
studentSchema.virtual('fullName').get(function () {
  return (
    this?.name?.firstName +
    ' ' +
    this?.name?.middleName +
    ' ' +
    this?.name?.lastName
  )
})

// Create the Mongoose model
export const Student = mongoose.model<TStudent>('Student', studentSchema)


