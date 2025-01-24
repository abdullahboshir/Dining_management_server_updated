import { Model, Types } from 'mongoose'

export type TMeal = {
  _id?: Types.ObjectId
  id: string
  student: Types.ObjectId
  mealStatus: 'off' | 'on'
  mealInfo: {
    [year: string]: {
      [month: string]: {
        maintenanceFee: number
        totalDeposit: number
        currentDeposit: number
        previousRefunded: number
        lastMonthDue: number
        totalMeal: number
        mealCharge: number
        fixedMeal: number
        fixedMealCharge: number
        totalCost: number
        dueDeposite: number
        refundable: number
      }
    }
  }
}

export interface TMealExists extends Model<TMeal> {
  isMealExists(id: string): Promise<TMeal | null>
}
