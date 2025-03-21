import status from 'http-status'
import AppError from '../../errors/AppError'
import { currentDateBD, previousDateBD } from '../../utils/currentDateBD'
import Meal from './meal.model'
import { mealInfoObj } from './meal.const'
import { Hall } from '../Hall/hall.model'
import { startSession } from 'mongoose'

export const countDueMaintenanceFee = async (mealInfo: any) => {
  let dueTotalMaintenanceCount = 0

  try {
    // Ensure mealInfo is defined and is an object
    if (
      mealInfo &&
      typeof mealInfo === 'object' &&
      Object.keys(mealInfo).length > 0
    ) {
      for (const year in mealInfo) {
        if (typeof mealInfo[year] !== 'object') continue // Skip invalid years

        for (const month in mealInfo[year]) {
          const monthData = mealInfo[year][month]

          // Ensure monthData is an object and has a valid maintenanceFee
          if (monthData && typeof monthData.maintenanceFee === 'number') {
            if (monthData.maintenanceFee === 0) {
              dueTotalMaintenanceCount++
            }
          } else {
            console.warn(`Skipping invalid month data:`, monthData)
          }
        }
      }
    }

    return dueTotalMaintenanceCount
  } catch (error: any) {
    console.error('Error calculating due months:', error.message)
    throw error
  }
}

export const calculationPreviousDeposit = async () => {
  const { previousYear, previousMonth } = previousDateBD()
  const { currentYear, currentMonth } = currentDateBD()

  try {
    // Fetch meals and hall data in parallel
    const [meals, hall] = await Promise.all([Meal.find(), Hall.findOne()])

    if (!meals.length) {
      throw new AppError(status.NOT_FOUND, 'Meals do not exist!')
    }

    for (const meal of meals) {
      const studentId = meal.student?.toString()
      if (!studentId) {
        console.warn(`Skipping meal ID: ${meal._id} due to missing student.`)
        continue
      }

      if (!meal?.mealInfo?.[currentYear]) {
        meal.mealInfo[currentYear] = {}
      }

      if (!meal?.mealInfo[currentYear][currentMonth]) {
        meal.mealInfo[currentYear][currentMonth] = mealInfoObj

        await Meal.findByIdAndUpdate(meal?._id, {
          $set: { mealInfo: meal.mealInfo },
        })
      }

      const basePreviousMealObj = meal.mealInfo?.[previousYear]?.[previousMonth]
      if (!basePreviousMealObj) {
        console.warn(
          `Skipping meal ID: ${meal._id} due to missing previous data.`,
        )
        continue
      }

      const baseCurrentMealObj = meal.mealInfo[currentYear][currentMonth]
      const maintenanceCharge = hall?.hallPolicies?.maintenanceCharge || 0

      let transferPreviousToCurrentDeposit =
        (basePreviousMealObj.currentDeposit || 0) +
        (baseCurrentMealObj?.currentDeposit || 0)
      const transferPreviousToTotalDeposit =
        (basePreviousMealObj.currentDeposit || 0) +
        (baseCurrentMealObj?.totalDeposit || 0)
      let isAvailableDepositForMaintenanceFee =
        baseCurrentMealObj?.maintenanceFee || 0

      if (
        transferPreviousToCurrentDeposit >= maintenanceCharge &&
        baseCurrentMealObj?.maintenanceFee === 0
      ) {
        transferPreviousToCurrentDeposit -= maintenanceCharge
        isAvailableDepositForMaintenanceFee = maintenanceCharge
      }

      const refunded =
        basePreviousMealObj?.currentDeposit > 0
          ? basePreviousMealObj.currentDeposit
          : baseCurrentMealObj?.refunded

      const result = await Meal.findByIdAndUpdate(meal._id, {
        $set: {
          [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
            transferPreviousToCurrentDeposit,
          [`mealInfo.${currentYear}.${currentMonth}.totalDeposit`]:
            transferPreviousToTotalDeposit,
          [`mealInfo.${currentYear}.${currentMonth}.maintenanceFee`]:
            isAvailableDepositForMaintenanceFee,
          [`mealInfo.${currentYear}.${currentMonth}.refunded`]: refunded,
          [`mealInfo.${previousYear}.${previousMonth}.currentDeposit`]: 0,
        },
      })

      console.log(`✅ Transferred deposit for meal ID: (Student: ${studentId})`)
    }
    return true
  } catch (error) {
    console.error('❌ Transaction aborted due to error:', error)
  }
}
