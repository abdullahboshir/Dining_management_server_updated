import { model, Schema } from 'mongoose'
import { TMeal, TMealExists } from './meal.interface'

// Define the main schema for meals
const mealSchema = new Schema<TMeal, TMealExists>(
  {
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
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student id is required'],
    },
    mealStatus: { type: String, enum: ['off', 'on'], default: 'off' },

    mealInfo: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
)

mealSchema.statics.isMealExists = async function (mealId: string) {
  const existingMeal = await Meal.findById({ _id: mealId })
  return existingMeal
}

// Pre-save middleware to update mealInfo dynamically based on the current year and month
// mealSchema.pre('save', function (next) {
//   const currentDate = new Date()
//   const currentYear = currentDate.getFullYear().toString()
//   const currentMonth = currentDate.toLocaleString('default', { month: 'long' })

//   // Initialize mealInfo if it doesn't exist
//   if (!this.mealInfo) {
//     this.mealInfo = {}
//   }

//   this.mealInfo[currentYear] = this.mealInfo[currentYear] || {}
//   this.mealInfo[currentYear][currentMonth] = {
//     maintenanceFee: 0,
//     totalDeposit: 0,
//     currentDeposit: 0,
//     lastMonthRefund: 0,
//     dueMaintenanceFee: 0,
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

// Create the model for Meals
const Meal = model<TMeal, TMealExists>('Meal', mealSchema)

export default Meal
