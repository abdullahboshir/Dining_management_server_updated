import { Model, Types } from 'mongoose'

export type TMeal = {
  _id?: Types.ObjectId
  id: string
  student: Types.ObjectId
  mealStatus: 'off' | 'on'
  mealCountUpdatedDate: Date
  lastUpdatedDate: Date
  mealInfo: {
    [year: string]: {
      [month: string]: {
        maintenanceFee: number
        totalDeposit: number
        currentDeposit: number
        dueMaintenanceFee: number
        totalMeals: number
        mealFee: number
        totalSpecialMeals: number
        specialMealFee: number
        totalCost: number
        refunded: number
      }
    }
  }
}

export interface TMealExists extends Model<TMeal> {
  isMealExists(id: Types.ObjectId): Promise<TMeal | null>
}
