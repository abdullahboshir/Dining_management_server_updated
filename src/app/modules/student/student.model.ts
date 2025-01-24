import mongoose, { Schema, Document } from 'mongoose'
import mealInfoSchema from '../Meal/meal.model'

import validator from 'validator'
import {
  StudentModel,
  TAddress,
  TGuardian,
  TStudent,
} from './student.interface'

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
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
    diningId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'dining',
      required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'manager',
      required: true,
    },
    id: {
      type: String,
      unique: true,
      required: [true, 'Please provide a Student ID'],
      index: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return /^[0-9]{13}$/.test(value.toString())
        },
        message: 'The Student ID must contain exactly 5 digits.',
      },
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
        validate: {
          validator: function (value: string) {
            const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1)
            return firstNameStr === value
          },
          message: 'First Letter should be a Uppercase',
        },
      },
      middleName: { type: String, required: true, trim: true },
      lastName: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: (value: string) => validator.isAlpha(value),
          message: '{VALUE} is not valid',
        },
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
      type: String,
      required: [true, 'Seat Number is required'],
      validate: {
        validator: function (value: string) {
          return /^[0-9]{2}$/.test(value.toString())
        },
        message: 'The Seat number must contain exactly 2 digits.',
      },
    },
    session: {
      type: String,
      required: [true, 'Please provide a Session of Student'],
      trim: true,
    },
    admissionFee: {
      type: Number,
      required: [true, 'Please provide an Admission Fee'],
      trim: true,
    },
    emergencyContact: {
      type: String,
      required: [true, 'Emergency Contact Number is required'],
    },
    profileImg: {
      type: String,
      required: [true, 'Image path is required'],
    },
    guardian: {
      type: guardianSchema,
      required: true,
    },
    presentAddress: {
      type: addressSchema,
      required: true,
    },
    permanentAddress: {
      type: addressSchema,
      required: true,
    },
    meals: {
      type: Schema.Types.ObjectId,
      ref: 'Meals',
      required: false,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: false,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

// Define pre-save middleware to update mealInfo dynamically based on year and month
// studentSchema.pre('save', function (next) {
//   const currentDate = new Date()
//   const currentYear = currentDate.getFullYear().toString()
//   const currentMonth = currentDate.toLocaleString('default', { month: 'long' })

//   // Initialize mealInfo if it doesn't exist
//   if (!this.meals) {
//     this.meals = {}
//   }

//   // Create or update the dynamic key based on the current year and month
//   this.meals[currentYear] = this.meals[currentYear] || {}
//   this.meals[currentYear][currentMonth] = {
//     mealStatus: 'off',
//     maintenanceFee: 0,
//     totalDeposit: 0,
//     currentDeposit: 0,
//     lastMonthRefund: 0,
//     lastMonthDue: 0,
//     totalMeal: 0,
//     mealCharge: 0,
//     fixedMeal: 0,
//     fixedMealCharge: 0,
//     totalCost: 0,
//     dueDeposite: 0,
//     refundable: 0,
//   }
//   next()
// })

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id })
  return existingUser
}

// another method pre function

// // Pre-save middleware to handle dynamic updates to mealInfo
// studentSchema.pre('save', function (next) {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear().toString();
//     const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

//     // Initialize mealInfo if not already set
//     if (!this.mealInfo) {
//       this.mealInfo = new Map();
//     }

//     // Initialize the year map if not already set
//     if (!this.mealInfo.has(currentYear)) {
//       this.mealInfo.set(currentYear, new Map());
//     }

//     const mealInfoForMonth = {
//       mealStatus: 'off',
//       maintenanceFee: 0,
//       totalDeposit: 0,
//       currentDeposit: 0,
//       lastMonthRefund: 0,
//       lastMonthDue: 0,
//       totalMeal: 0,
//       mealCharge: 0,
//       fixedMeal: 0,
//       fixedMealCharge: 0,
//       totalCost: 0,
//       dueDeposite: 0,
//       refundable: 0,
//     };

//     // Set the mealInfo for the current month and year
//     this.mealInfo.get(currentYear).set(currentMonth, mealInfoForMonth);

//     next();
//   });

// set new index and unique
// studentSchema.index({ studentId: 1, studentPin: 1 }, { unique: true })

// Create the Mongoose model
const Student = mongoose.model<TStudent, StudentModel>('Student', studentSchema)

export default Student
