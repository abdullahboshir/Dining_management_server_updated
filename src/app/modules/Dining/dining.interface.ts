import mongoose from 'mongoose'

export type TDiningPolicies = {
  mealCharge: number
  specialMealCharge: number
  minimumDeposit: number
  reservedSafetyDeposit: number
}

export type TDiningSummary = {
  totalMeals: number
  totalSpecialMeals: number
  totalDepositedAmount: number
  totalExpendedAmount: number
  remainingAmount: number
}

export type TDining = {
  hall: mongoose.Schema.Types.ObjectId
  diningName: string
  diningPolicies?: TDiningPolicies | undefined
  diningSummary: TDiningSummary
}
