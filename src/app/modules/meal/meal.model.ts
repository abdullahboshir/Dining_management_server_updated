import { Schema } from 'mongoose'
import { TMealInfo } from './meal.interface'

// Define the schema for meal info
const mealInfoSchema = new Schema<TMealInfo | undefined>(
  {
    mealStatus: { type: String, enum: ['off', 'on'], default: 'off' },
    maintenanceFee: { type: Number, default: 0 },
    totalDeposit: { type: Number, default: 0 },
    currentDeposit: { type: Number, default: 0 },
    lastMonthRefund: { type: Number, default: 0 },
    lastMonthDue: { type: Number, default: 0 },
    totalMeal: { type: Number, default: 0 },
    mealCharge: { type: Number, default: 0 },
    fixedMeal: { type: Number, default: 0 },
    fixedMealCharge: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    dueDeposite: { type: Number, default: 0 },
    refundable: { type: Number, default: 0 },
  },
  { _id: false },
)

export default mealInfoSchema
