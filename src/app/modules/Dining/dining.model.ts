import mongoose, { Schema } from 'mongoose'
import { TDining, TDiningPolicies, TDiningSummary } from './dining.interface'

const diningPoliciesSchema = new Schema<TDiningPolicies>(
  {
    mealCharge: { type: Number, default: 0 },
    specialMealCharge: { type: Number, default: 0 },
    minimumDeposit: { type: Number, default: 0 },
    reservedSafetyDeposit: { type: Number, default: 0 },
  },
  { _id: false },
)

const diningSummarySchema = new Schema<TDiningSummary>(
  {
    totalMeals: { type: Number, default: 0 },
    totalSpecialMeals: { type: Number, default: 0 },
    totalDepositedAmount: { type: Number, default: 0 },
    totalExpendedAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
  },
  { _id: false },
)

// Create a new Schema for Dining
const diningSchema = new Schema<TDining>(
  {
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hall',
    },
    diningName: {
      type: String,
      required: [true, 'Please provide a Name'],
      unique: true,
      trim: true,
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [100, 'Name is too large'],
    },
    diningPolicies: diningPoliciesSchema,
    diningSummary: diningSummarySchema,
  },
  { timestamps: true },
)

diningSchema.pre('save', function (next) {
  if (!this.diningPolicies) {
    this.diningPolicies = {
      mealCharge: 0,
      specialMealCharge: 0,
      minimumDeposit: 0,
      reservedSafetyDeposit: 0,
    }
  }

  if (!this.diningSummary) {
    this.diningSummary = {
      totalMeals: 0,
      totalSpecialMeals: 0,
      totalDepositedAmount: 0,
      totalExpendedAmount: 0,
      remainingAmount: 0,
    }
  }
  next()
})

// Create Dining model
export const Dining = mongoose.model<TDining>('Dining', diningSchema)
