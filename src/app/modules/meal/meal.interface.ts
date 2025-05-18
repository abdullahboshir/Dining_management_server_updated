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
        dailyMealHistory: {
          [day: string]: number
        }
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

const dailyMealHistoryArr = [
  0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
]
const dailyMealHistoryArrOfObj = [
  {1: 0},
  {2: 0},
  {3: 1},
  {4: 1},
  {5: 1},
  {6: 1},
  {7: 1},
  {8: 0},
  {10: 1},
  {11: 0},
  {12: 0},
  {13: 1},
  {14: 1},
  {15: 1},
  {16: 1},
  {17: 0},
]
