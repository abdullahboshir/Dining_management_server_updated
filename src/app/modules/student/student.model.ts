import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import mealInfoSchema from '../meal/meal.model'
import { TAddress, TGuardian, TStudent } from './student.interface'

// Guardian Subdocument Schema
const guardianSchema = new Schema<TGuardian>(
  {
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherContactNo: { type: String, required: true },
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
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    diningId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dining',
      required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
      required: true,
    },
    studentId: {
      type: Number,
      required: [true, 'Please provide a Student ID'],
      index: true,
      trim: true,
      validate: {
        validator: function (value: number) {
          return /^[0-9]{5}$/.test(value.toString())
        },
        message: 'The Student ID must contain exactly 5 digits.',
      },
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
      firstName: { type: String, required: true, trim: true },
      middleName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'other'],
      required: true,
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
    session: {
      type: String,
      required: [true, 'Please provide a Session of Student'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
      set: (value: string) => value.toLowerCase(),
    },
    department: {
      type: String,
      required: [true, 'Please provide a Department of Student'],
      trim: true,
    },
    admissionFee: {
      type: Number,
      required: [true, 'Please provide an Admission Fee'],
      trim: true,
    },
    emailOrPhoneNumber: {
      type: String,
      required: [true, 'Email or Phone Number is required'],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      validate: {
        async validator(v: string) {
          const count = await mongoose.models.Student.countDocuments({
            emailOrPhoneNumber: v,
          })
          if (count > 0) {
            const existing = await mongoose.models.Student.findOne({
              emailOrPhoneNumber: v,
            })
            if (!(existing._id.toString() === this._id?.toString())) {
              throw new Error('Email or Phone Number must be unique.')
            }
          }
          return (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{5})$/.test(v)
          ) // Email or phone validation
        },
        message: (props) =>
          `${props.value} is not a valid Email or Phone Number`,
      },
    },
    imergencyContact: {
      type: String,
      required: [true, 'Emergency Contact is required'],
    },
    password: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'manager', 'user', 'moderator'],
      default: 'user',
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
    mealInfo: {
      type: Map,
      of: mealInfoSchema,
      default: {},
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

// Define pre-save middleware to update mealInfo dynamically based on year and month
studentSchema.pre('save', function (next) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear().toString()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })

  // Initialize mealInfo if it doesn't exist
  if (!this.mealInfo) {
    this.mealInfo = {}
  }

  // Create or update the dynamic key based on the current year and month
  this.mealInfo[currentYear] = this.mealInfo[currentYear] || {}
  this.mealInfo[currentYear][currentMonth] = {
    mealStatus: 'off',
    maintenanceFee: 0,
    totalDeposit: 0,
    currentDeposit: 0,
    lastMonthRefund: 0,
    lastMonthDue: 0,
    totalMeal: 0,
    mealCharge: 0,
    fixedMeal: 0,
    fixedMealCharge: 0,
    totalCost: 0,
    dueDeposite: 0,
    refundable: 0,
  }
  next()
})

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

// Define a method to compare the password with the hashed password
studentSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

// Create the Mongoose model
const Student = mongoose.model<Document & TStudent>('Student', studentSchema)

export default Student
