import { startSession, Types } from 'mongoose'
import {
  currentDateBD,
  getFutureDate,
  previousDateBD,
} from '../../utils/currentDateBD'
import Student from '../Student/student.model'
import Meal from './meal.model'
import { mealInfoObj } from './meal.const'
import { Dining } from '../Dining/dining.model'
import { Hall } from '../Hall/hall.model'
import AppError from '../../errors/AppError'
import status from 'http-status'
import { countDueMaintenanceFee } from './meal.utils'
import { USER_STATUS, USER_STATUS_ARRAY } from '../User/user.constant'

export const getMealsService = async () => {
  const data = await Meal.find().populate({
    path: 'student',
    populate: [{ path: 'hall' }, { path: 'dining' }],
  })
  return {
    meta: {
      total: 10,
      page: 2,
      limit: 5,
    },
    data,
  }
}

// export const startMealUpdate = (mealId: Types.ObjectId) => {
//   const updateInterval =
//     process.env.NODE_ENV === 'development' ? 2000 : 24 * 60 * 60 * 1000
//   // 2 seconds in dev, 24 hours in prod

//   setInterval(async () => {
//     try {
//       const forceUpdate = process.env.NODE_ENV === 'development' // Force update every 2s in dev
//       const updatedMeal = await updateMealInfoIfNeeded(mealId, forceUpdate)
//       if (updatedMeal) {
//         console.log('✅ Meal info updated:', updatedMeal.mealInfo)
//       } else {
//         console.log('⏳ Meal info check passed, no update needed.')
//       }
//     } catch (error) {
//       console.error('Meal update failed:', error)
//     }
//   }, updateInterval)
// }

// export const updateMealInfoIfNeeded = async (
//   mealId: Types.ObjectId,
//   forceUpdate = false,
// ) => {
//   const meal = await Meal.findById(mealId)
//   if (!meal) {
//     throw new AppError(status.FORBIDDEN, 'The Meal does not exist!')
//   }

//   const { currentYear, currentMonth } = currentDateBD()
//   const mealCharge = meal.mealInfo[currentYear]?.[currentMonth]?.mealFee || 0

//   // Initialize mealInfo for the current year/month if missing
//   if (!meal.mealInfo[currentYear]) {
//     meal.mealInfo[currentYear] = {}
//   }
//   if (!meal.mealInfo[currentYear][currentMonth]) {
//     meal.mealInfo[currentYear][currentMonth] = mealInfoObj
//   }

//   const now = new Date()
//   const lastUpdateDiffHours =
//     Math.abs(now.getTime() - meal.mealCountUpdatedDate.getTime()) / 3600000 // Convert ms to hours

//   console.log(
//     `⏳ Checking meal info... Last update: ${lastUpdateDiffHours.toFixed(2)} hours ago.`,
//   )

//   // ✅ In production: update only if 24 hours passed
//   // ✅ In development: always update (forceUpdate = true)
//   if (meal.mealStatus === 'on' && (forceUpdate || lastUpdateDiffHours >= 24)) {
//     // Increase meal count
//     const baseMealObj = meal.mealInfo[currentYear][currentMonth]
//     const mealIncreamentAmount = 1
//     const increamentTotal = baseMealObj.totalMeals + mealIncreamentAmount
//     const multiplyMealCharge = mealCharge * mealIncreamentAmount
//     const currentDeposit = baseMealObj.currentDeposit - multiplyMealCharge
//     const totalCost = baseMealObj.totalCost + multiplyMealCharge

//     const result = await Meal.findByIdAndUpdate(
//       mealId,
//       {
//         $set: {
//           [`mealInfo.${currentYear}.${currentMonth}.totalMeals`]:
//             increamentTotal,
//           [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
//             currentDeposit,
//           [`mealInfo.${currentYear}.${currentMonth}.totalCost`]: totalCost,
//           mealCountUpdatedDate: now, // ✅ Ensure mealCountUpdatedDate updates
//           lastUpdatedDate: now, // ✅ Always update lastUpdatedDate
//         },
//       },
//       { new: true },
//     )

//     console.log(
//       '✅ Meal info updated:',
//       result?.mealInfo[currentYear][currentMonth],
//     )
//     return result
//   }

//   return null // ❌ No update was made
// }

// export const updateMealInfoIfDateChanged = async (mealId: Types.ObjectId) => {
//   const meal = await Meal.findById(mealId)
//   if (!meal) {
//     throw new Error('Meal not found')
//   }

//   const { currentYear, currentMonth } = currentDateBD() // Get current year and month

//   // Initialize mealInfo for current year and month if not already initialized
//   if (!meal.mealInfo[currentYear]) {
//     meal.mealInfo[currentYear] = {}
//   }

//   if (!meal.mealInfo[currentYear][currentMonth]) {
//     meal.mealInfo[currentYear][currentMonth] = mealInfoObj
//   }

//   // Check if mealCountUpdateDate is older than 24 hours (only if mealStatus is "on")
//   if (meal.mealStatus === 'on') {
//     const now = new Date()
//     const diffInHours =
//       Math.abs(now.getTime() - meal.mealCountUpdatedDate.getTime()) /
//       (1000 * 3600)

//     // If more than 24 hours have passed, update the meal count and reset the meal count update date
//     if (diffInHours >= 24) {
//       meal.mealCountUpdatedDate = now // Update the meal count update date to the current date/time
//       // Here you can add logic for updating meal count (totalMeals, specialMeal count etc.)
//     }
//   }

//   // Save the updated meal record
//   await meal.save()

//   return meal
// }

// You can create other service methods here as necessary for other business logic

const mealIntervals: { [key: string]: NodeJS.Timeout } = {}
const startMealIncreament = (mealId: Types.ObjectId) => {
  if (mealIntervals[mealId.toString()]) return

  const updateIntervalShedule =
    process.env.NODE_ENV === 'development' ? 2000 : 24 * 60 * 60 * 1000

  mealIntervals[mealId.toString()] = setInterval(
    async () => {
      const [isMealExists, hall, dining] = await Promise.all([
        Meal.isMealExists(mealId),
        Hall.findOne(),
        Dining.findOne(),
      ])

      if (!isMealExists) {
        stopMealIncrement(mealId)
        return { status: false, message: 'the Meal is not exists! ' }
      }

      if (isMealExists.mealStatus === 'off') {
        stopMealIncrement(mealId)
        return { status: false, message: 'the Meal is not Off! ' }
      }

      const { currentYear, currentMonth } = currentDateBD()
      const { previousYear, previousMonth } = previousDateBD()
      // const { futureYear, futureMonth, futureDay } = getFutureDate(1, 1, 2)
      // console.log(`Last day of the month is: `, previousYear, previousMonth)

      const updateQuery: any = {}
      const isExistsCurrentYear = isMealExists.mealInfo[currentYear] ?? {}
      const isExistsCurrentMonth = isExistsCurrentYear[currentMonth] ?? null
      if (!isExistsCurrentMonth) {
        updateQuery[`mealInfo.${currentYear}.${currentMonth}`] = mealInfoObj
      }

      if (Object.keys(updateQuery).length) {
        await Meal.findByIdAndUpdate(isMealExists._id, { $set: updateQuery })
      }

      // if the currentDeposit is less then 80 then apply the feature
      const baseMealObj = isMealExists?.mealInfo[currentYear][currentMonth]
      const mealCharge = (dining?.diningPolicies?.mealCharge as number) || 0
      const maintenanceCharge = hall?.hallPolicies?.maintenanceCharge || 0
      const isDueMaintenanceFee = baseMealObj.maintenanceFee < maintenanceCharge
      const newDate = new Date()

      const reservedSafetyDeposit =
        dining?.diningPolicies &&
        baseMealObj.currentDeposit <=
          mealCharge +
            (mealCharge / 100) * dining?.diningPolicies?.reservedSafetyDeposit

      if (
        (isMealExists.mealStatus === 'on' && reservedSafetyDeposit) ||
        isDueMaintenanceFee
      ) {
        stopMealIncrement(isMealExists._id as Types.ObjectId)

        await Meal.findByIdAndUpdate(
          { _id: isMealExists._id },
          { $set: { mealStatus: 'off' } },
        )

        return {
          success: false,
          statusCode: 403,
          message: `Your current deposit is very low ${baseMealObj.currentDeposit}`,
        }
      }

      const mealIncreamentAmount = 1
      const increamentTotal = baseMealObj.totalMeals + mealIncreamentAmount

      const multiplyMealCharge = mealCharge * mealIncreamentAmount
      const currentDeposit = baseMealObj.currentDeposit - multiplyMealCharge
      const totalCost = baseMealObj.totalCost + multiplyMealCharge

      const result = await Meal.findByIdAndUpdate(
        mealId,
        {
          $set: {
            [`mealInfo.${currentYear}.${currentMonth}.totalMeals`]:
              increamentTotal,
            [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
              currentDeposit,
            [`mealInfo.${currentYear}.${currentMonth}.totalCost`]: totalCost,
            mealCountUpdatedDate: newDate,
          },
        },
        { new: true },
      )

      console.log(
        'ddddddddddddddd',
        result?.mealInfo[currentYear][currentMonth],
      )
      if (!result) {
        throw new AppError(status.BAD_REQUEST, 'Meal update Failed')
      }

      return result
    },
    updateIntervalShedule,

    // 24 * 60 * 60 * 1000,
  )
}

// Stop the meal increment if the meal status is changed to 'off'
const stopMealIncrement = (mealId: Types.ObjectId) => {
  const intervalId = mealIntervals[mealId.toString()]
  if (intervalId) {
    clearInterval(intervalId)
    delete mealIntervals[mealId.toString()] // Optionally delete the interval ID from the object
    console.log(`Meal increment stopped for meal ID: ${mealId}`)
  } else {
    console.log('No active meal increment found for this meal ID')
  }
}

export const updateMealStatusService = async (
  mealId: Types.ObjectId,
  mealStatus: string,
) => {
  if (!['on', 'off'].includes(mealStatus)) {
    throw new AppError(status.BAD_REQUEST, 'Invalid meal status')
  }

  const [isMealExists, hall, dining] = await Promise.all([
    Meal.isMealExists(mealId),
    Hall.findOne(),
    Dining.findOne(),
  ])

  if (!isMealExists) {
    throw new AppError(status.FORBIDDEN, 'the Meal is not exists! ')
  }

  const isStudentExists = await Student.findOne({
    id: isMealExists.id,
    _id: isMealExists.student,
  })

  if (!isStudentExists) {
    throw new AppError(status.NOT_FOUND, 'The Student deos not exists! ')
  }

  if (
    [USER_STATUS.INACTIVE, USER_STATUS.BLOCKED].includes(isStudentExists.status)
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      `The Student is ${isStudentExists.status}`,
    )
  }

  const { currentYear, currentMonth } = currentDateBD()

  // //   if not present new year and new month then set

  const updateQuery: any = {}
  const isExistsCurrentYear = isMealExists.mealInfo[currentYear] ?? {}
  const isExistsCurrentMonth = isExistsCurrentYear[currentMonth] ?? null
  if (!isExistsCurrentMonth) {
    updateQuery[`mealInfo.${currentYear}.${currentMonth}`] = mealInfoObj
  }

  if (Object.keys(updateQuery).length) {
    await Meal.findByIdAndUpdate(isMealExists._id, { $set: updateQuery })
  }

  const maintenanceCharge =
    (hall?.hallPolicies?.maintenanceCharge as number) || 0
  const minimumDeposit = (dining?.diningPolicies?.minimumDeposit as number) || 0

  const baseMealObj = isMealExists?.mealInfo[currentYear][currentMonth]
  const isDueMaintenanceFee = baseMealObj.maintenanceFee < maintenanceCharge
  const isDepositLow = baseMealObj.currentDeposit < minimumDeposit

  if (mealStatus === 'on' && (isDueMaintenanceFee || isDepositLow)) {
    throw new AppError(
      status.BAD_REQUEST,
      'Your current deposit is low, please deposit before',
    )
  }

  if (mealStatus === 'on' && isMealExists.mealStatus === 'on') {
    return { success: false, message: 'The meal is already on' }
  }

  if (mealStatus === 'off' && isMealExists.mealStatus === 'off') {
    return { success: false, message: 'The meal is already off' }
  }

  const mealSwitch = await Meal.findByIdAndUpdate(
    { _id: isMealExists._id },
    { $set: { mealStatus } },
    { new: true },
  )

  if (!mealSwitch) {
    throw new AppError(status.BAD_REQUEST, 'Update failed')
  }

  // if meal is off
  mealSwitch?.mealStatus === 'on'
    ? startMealIncreament(mealSwitch._id)
    : stopMealIncrement(mealSwitch._id)

  // mealSwitch.mealStatus === 'on' && startMealUpdate(mealSwitch._id)

  return mealSwitch
}

// -------------------------------------
// add meal Deposit
export const addMealDepositService = async (
  mealId: Types.ObjectId,
  inputCurrentDeposit: number,
) => {
  const isMealExists = await Meal.isMealExists(mealId)
  const hall = await Hall.find()
  const dining = await Dining.find()

  if (!isMealExists) {
    throw new AppError(status.NOT_FOUND, 'the Meal is not exists! ')
  }

  const isStudentExists = await Student.findOne({
    id: isMealExists.id,
    _id: isMealExists.student,
  })

  const maintenanceCharge = hall[0]?.hallPolicies?.maintenanceCharge as number
  const minimumDeposit = dining[0]?.diningPolicies?.minimumDeposit as number

  if (!isStudentExists) {
    throw new AppError(status.NOT_FOUND, 'the Meal is not exists! ')
  }

  if (isStudentExists.status === 'inactive') {
    throw new AppError(status.NOT_FOUND, 'The Student is inactive')
  }

  if (isStudentExists.status === 'blocked') {
    throw new AppError(status.NOT_FOUND, 'The Student is blocked')
  }

  const { currentYear, currentMonth } = currentDateBD()
  const { previousYear, previousMonth } = previousDateBD()
  //   const currentYear = '2026'
  //   const currentMonth = 'May'

  //   if not present new year and new month then set
  if (isMealExists && !isMealExists.mealInfo[currentYear]) {
    isMealExists.mealInfo[currentYear] = {}
  }
  if (!isMealExists.mealInfo[currentYear][currentMonth]) {
    isMealExists.mealInfo[currentYear][currentMonth] = mealInfoObj // the mealInfoObj import from constant
  }

  // Example usage

  const session = await startSession()
  const baseCurrentMealObj = isMealExists.mealInfo[currentYear][currentMonth]
  const basePreviousMealObj = isMealExists.mealInfo[previousYear][previousMonth]

  try {
    session.startTransaction()
    let result

    const isHavePreviousDeposit =
      basePreviousMealObj &&
      basePreviousMealObj?.currentDeposit > 0 &&
      basePreviousMealObj?.totalDeposit > 0 &&
      basePreviousMealObj?.maintenanceFee >= 0
    if (isHavePreviousDeposit) {
      const dueMaintenanceFee = await countDueMaintenanceFee(
        isMealExists?.mealInfo,
      )

      let transferPreviousToCurrentDeposit =
        basePreviousMealObj?.currentDeposit +
        baseCurrentMealObj?.currentDeposit +
        inputCurrentDeposit

      const transferPreviousToTotalDeposit =
        baseCurrentMealObj?.totalDeposit +
        basePreviousMealObj?.currentDeposit +
        inputCurrentDeposit

      let isAvailableDepositForMaintenanceFee = 0
      if (transferPreviousToCurrentDeposit > maintenanceCharge) {
        transferPreviousToCurrentDeposit -= maintenanceCharge
        isAvailableDepositForMaintenanceFee += maintenanceCharge
      }

      const calculateTotalDueMaintenanceFee =
        dueMaintenanceFee * maintenanceCharge

      result = await Meal.findByIdAndUpdate(
        { _id: isMealExists._id },
        {
          $set: {
            [`mealInfo.${previousYear}.${previousMonth}.currentDeposit`]: 0,
            [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
              transferPreviousToCurrentDeposit,
            [`mealInfo.${currentYear}.${currentMonth}.totalDeposit`]:
              transferPreviousToTotalDeposit,
            [`mealInfo.${currentYear}.${currentMonth}.maintenanceFee`]:
              isAvailableDepositForMaintenanceFee,
            [`mealInfo.${currentYear}.${currentMonth}.dueMaintenanceFee`]:
              calculateTotalDueMaintenanceFee,
            [`mealInfo.${currentYear}.${currentMonth}.refunded`]:
              basePreviousMealObj.currentDeposit,
          },
        },
        { new: true, session },
      )
      return result
    }

    if (
      baseCurrentMealObj.currentDeposit < minimumDeposit &&
      inputCurrentDeposit < minimumDeposit
    ) {
      throw new AppError(
        status.BAD_REQUEST,
        `First Deposit should be Minimum ${minimumDeposit}`,
      )
    }

    let addToCurrentDeposit = basePreviousMealObj
      ? baseCurrentMealObj.currentDeposit +
        basePreviousMealObj.currentDeposit +
        inputCurrentDeposit
      : baseCurrentMealObj.currentDeposit + inputCurrentDeposit

    const addToTotalDeposit = basePreviousMealObj
      ? baseCurrentMealObj.totalDeposit +
        basePreviousMealObj.currentDeposit +
        inputCurrentDeposit
      : baseCurrentMealObj.totalDeposit + inputCurrentDeposit

    let addToMaintenanceFee

    if (
      (baseCurrentMealObj?.maintenanceFee < maintenanceCharge &&
        addToCurrentDeposit >= maintenanceCharge) ||
      (baseCurrentMealObj?.maintenanceFee < maintenanceCharge &&
        baseCurrentMealObj?.currentDeposit > maintenanceCharge)
    ) {
      addToCurrentDeposit -= maintenanceCharge

      addToMaintenanceFee =
        baseCurrentMealObj.maintenanceFee + maintenanceCharge
    }

    result = await Meal.findByIdAndUpdate(
      { _id: isMealExists._id },
      {
        $set: {
          [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
            addToCurrentDeposit,
          [`mealInfo.${currentYear}.${currentMonth}.totalDeposit`]:
            addToTotalDeposit,
          [`mealInfo.${currentYear}.${currentMonth}.maintenanceFee`]:
            addToMaintenanceFee,
        },
      },
      { new: true, session },
    )

    if (!result) {
      throw new AppError(status.BAD_REQUEST, 'Failed to Deposit')
    }

    await session.commitTransaction()
    await session.endSession()

    return result
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error.message)
  }
}
