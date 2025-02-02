import mongoose from 'mongoose'

export type TDiningPolicies = {
  mealCharge: number
  specialMealCharge: number
}

export type TDiningSummary = {
  totalMeals: number
  totalSpecialMeals: number
  totalDepositedAmount: number
  totalExpendedAmount: number
  remainingAmount: number
}

export type TDining = {
  hallId?: mongoose.Schema.Types.ObjectId
  diningName: string
  diningPolicies?: TDiningPolicies | undefined
  diningSummary: TDiningSummary
}
