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
        dueMaintenanceFee: number
        totalMeals: number
        mealFee: number
        totalSpecialMeals: number
        specialMealFee: number
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
