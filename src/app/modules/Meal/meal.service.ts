import { startSession, Types } from 'mongoose'
import {
  currentDateBD,
} from '../../utils/currentDateBD'

import {Meal} from './meal.model'
import { mealInfoObj, mealSearchableFields } from './meal.const'
import { Dining } from '../Dining/dining.model'
import { Hall } from '../Hall/hall.model'
import AppError from '../../errors/AppError'
import status from 'http-status'
import {
  calculationPreviousDeposit,
  countDueMaintenanceFee,
} from './meal.utils'
import { USER_STATUS } from '../User/user.constant'
import QueryBuilder from '../../builder/QueryBuilder'
import { Student } from '../Student/student.model'


const { currentYear, currentMonth, currentDay } = currentDateBD()

export const getMealsService = async (query: Record<string, unknown>) => {
  const mealQuery = new QueryBuilder(
    Meal.find().populate({
      path: 'student',
      populate: [{ path: 'hall' }, { path: 'dining' }, { path: 'user' }],
    }),
    query,
  ).search(mealSearchableFields)

  const result = await mealQuery.modelQuery

  // const result = await Meal.find().populate({path: 'student', populate: [{path: 'user'}, {path: 'dining'}, {path: 'hall'}]})

  // console.log('rewultttttttt', result)

  if (!result) {
    return { status: false, message: 'the Meal is not exists! ' }
  }

  return {
    meta: {
      total: 10,
      page: 2,
      limit: 5,
    },
    data: result,
  }
}

export const getSingleMealService = async (id: string) => {
  const data = await Meal.findById(id).populate({
    path: 'student',
    populate: [{ path: 'hall' }, { path: 'dining' }],
  })

  return data
}

const mealIntervals: Map<string, NodeJS.Timeout> = new Map()
const isRunning: Set<string> = new Set()

const startMealIncrement = async (mealId: Types.ObjectId) => {
  if (
    mealIntervals.has(mealId.toString()) ||
    isRunning.has(mealId.toString())
  ) {
    return
  }

  const updateMealSchedule =
    process.env.NODE_ENV === 'development' ? 2000 : 24 * 60 * 60 * 1000

  const runMealUpdate = async () => {
    isRunning.add(mealId.toString())

    try {
      // if (currentDay === 1) {
      const isHavePreviousDeposit = await calculationPreviousDeposit()
      if (isHavePreviousDeposit) {
        // console.log('✅ Previous deposit calculation successful')
      } else {
        console.error('❌ Previous deposit calculation failed')
        return
      }
      // }

      const [isMealExists, hall, dining] = await Promise.all([
        Meal.isMealExists(mealId),
        Hall.findOne(),
        Dining.findOne(),
      ])

      if (!isMealExists) {
        stopMealIncrement(mealId)
        return { status: false, message: 'the Meal is not exists! ' }
      }

      const haveCountDueMaintenanceFee = await countDueMaintenanceFee(
        isMealExists?.mealInfo,
      )

      const dueMaintenanceFeeUpdated = await Meal.findByIdAndUpdate(
        mealId,
        {
          $set: {
            [`mealInfo.${currentYear}.${currentMonth}.dueMaintenanceFee`]:
              haveCountDueMaintenanceFee,
            // mealCountUpdatedDate: newDate,
          },
        },
        { new: true },
      )

      if (!dueMaintenanceFeeUpdated) {
        throw new AppError(status.BAD_REQUEST, 'Meal update Failed')
      }

      const isStudentExists = (await Student.findOne({
        id: isMealExists.id,
        _id: isMealExists.student,
      }).populate('user')) as any

      if (
        [USER_STATUS.INACTIVE, USER_STATUS.BLOCKED].includes(
          isStudentExists?.user?.status,
        )
      ) {
        stopMealIncrement(mealId)
        throw new AppError(
          status.BAD_REQUEST,
          `The Student is ${isStudentExists?.user?.status}`,
        )
      }

      if (isMealExists.mealStatus === 'off') {
        stopMealIncrement(mealId)
        return { status: false, message: 'the Meal is not Off! ' }
      }

      const updateQuery: any = {}
      const isExistsCurrentYear = isMealExists.mealInfo[currentYear] ?? {}
      const isExistsCurrentMonth = isExistsCurrentYear[currentMonth] ?? null
      if (!isExistsCurrentMonth) {
        updateQuery[`mealInfo.${currentYear}.${currentMonth}`] = mealInfoObj
      }

      if (Object.keys(updateQuery).length) {
        await Meal.findByIdAndUpdate(isMealExists._id, { $set: updateQuery })
      }

      const baseCurrentMealObj =
        isMealExists.mealInfo[currentYear][currentMonth]

      const mealCharge = (dining?.diningPolicies?.mealCharge as number) || 0
      const maintenanceCharge = hall?.hallPolicies?.maintenanceCharge || 0
      const isDueMaintenanceFee =
        baseCurrentMealObj.maintenanceFee < maintenanceCharge
      const newDate = new Date()
      const reservedSafetyDeposit =
        dining?.diningPolicies &&
        baseCurrentMealObj.currentDeposit <=
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
          message: `Your current deposit is very low ${baseCurrentMealObj.currentDeposit}`,
        }
      }

      const mealIncrementAmount = 1
      const increamentTotal =
        baseCurrentMealObj.totalMeals + mealIncrementAmount
      const currentDeposit = baseCurrentMealObj.currentDeposit - mealCharge
      const totalCost = baseCurrentMealObj.totalCost + mealCharge

      console.log('current dayyyyyyyyyy', currentDay, mealIncrementAmount)

      const result = await Meal.findByIdAndUpdate(
        mealId,
        {
          $set: {
            [`mealInfo.${currentYear}.${currentMonth}.totalMeals`]:
              increamentTotal,
            [`mealInfo.${currentYear}.${currentMonth}.dailyMealHistory.${currentDay}`]:
              1,
            [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
              currentDeposit,
            [`mealInfo.${currentYear}.${currentMonth}.dueMaintenanceFee`]:
              haveCountDueMaintenanceFee,
            [`mealInfo.${currentYear}.${currentMonth}.totalCost`]: totalCost,

            mealCountUpdatedDate: newDate,
          },
        },
        { new: true },
      )

      if (!result) {
        throw new AppError(status.BAD_REQUEST, 'Meal update Failed')
      }

      return result
    } catch (error) {
      console.error('Meal update failed:', error)
    } finally {
      isRunning.delete(mealId.toString()) // Mark as not running
      // Reschedule the next execution only if no errors
      if (!isRunning.has(mealId.toString())) {
        mealIntervals.set(
          mealId.toString(),
          setTimeout(runMealUpdate, updateMealSchedule),
        )
      }
    }
  }

  // Start the first execution
  mealIntervals.set(
    mealId.toString(),
    setTimeout(runMealUpdate, updateMealSchedule),
  )
  isRunning.add(mealId.toString())
}

// Stop the meal increment if the meal status is changed to 'off'
const stopMealIncrement = (mealId: Types.ObjectId) => {
  if (mealIntervals.has(mealId.toString())) {
    clearTimeout(mealIntervals.get(mealId.toString()) as NodeJS.Timeout)
    mealIntervals.delete(mealId.toString())
    console.log(`Meal increment stopped for meal ID: ${mealId}`)
  } else {
    console.log('No active meal increment found for this meal ID.')
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

  const isStudentExists = (await Student.findOne({
    id: isMealExists.id,
    _id: isMealExists.student,
  }).populate('user')) as any

  if (!isStudentExists) {
    throw new AppError(status.NOT_FOUND, 'The Student deos not exists! ')
  }

  if (
    [USER_STATUS.INACTIVE, USER_STATUS.BLOCKED].includes(
      isStudentExists?.user?.status,
    )
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
  const mealCharge = dining?.diningPolicies?.mealCharge as number

  const baseCurrentMealObj = isMealExists?.mealInfo[currentYear][currentMonth]
  const isDueMaintenanceFee =
    baseCurrentMealObj.maintenanceFee < maintenanceCharge

  const reservedSafetyDeposit =
    dining?.diningPolicies &&
    baseCurrentMealObj.currentDeposit <=
      mealCharge +
        (mealCharge / 100) * dining?.diningPolicies?.reservedSafetyDeposit

  if (mealStatus === 'on' && (isDueMaintenanceFee || reservedSafetyDeposit)) {
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
  // mealSwitch?.mealStatus === 'on'
  startMealIncrement(mealSwitch._id)
  // : stopMealIncrement(mealSwitch._id)

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

  if (
    [USER_STATUS.INACTIVE, USER_STATUS.BLOCKED].includes(isStudentExists.status)
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      `The Student is ${isStudentExists.status}`,
    )
  }

  // const { previousYear, previousMonth } = previousDateBD()

  //   if not present new year and new month then set
  const session = await startSession()
  session.startTransaction()

  if (isMealExists && !isMealExists.mealInfo[currentYear]) {
    isMealExists.mealInfo[currentYear] = {}
  }
  if (!isMealExists.mealInfo[currentYear][currentMonth]) {
    isMealExists.mealInfo[currentYear][currentMonth] = mealInfoObj

    await Meal.findByIdAndUpdate(
      isMealExists?._id,
      {
        $set: { mealInfo: isMealExists.mealInfo },
      },
      { session },
    )
  }

  // Example usage

  const baseCurrentMealObj = isMealExists.mealInfo[currentYear][currentMonth]
  // const basePreviousMealObj = isMealExists.mealInfo[previousYear][previousMonth]

  try {
    let result

    if (
      baseCurrentMealObj.currentDeposit < minimumDeposit &&
      inputCurrentDeposit < minimumDeposit
    ) {
      throw new AppError(
        status.BAD_REQUEST,
        `First Deposit should be Minimum ${minimumDeposit}`,
      )
    }

    let addToCurrentDeposit =
      baseCurrentMealObj.currentDeposit + inputCurrentDeposit
    const addToTotalDeposit =
      baseCurrentMealObj.totalDeposit + inputCurrentDeposit

    let addToMaintenanceFee = baseCurrentMealObj?.maintenanceFee

    if (
      (baseCurrentMealObj?.maintenanceFee < maintenanceCharge &&
        addToCurrentDeposit >= maintenanceCharge) ||
      (baseCurrentMealObj?.maintenanceFee < maintenanceCharge &&
        baseCurrentMealObj?.currentDeposit > maintenanceCharge)
    ) {
      addToCurrentDeposit -= maintenanceCharge

      addToMaintenanceFee = maintenanceCharge
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

// const updateMeal = () => {
//   console.log('success every 3 secound')
// }

// const updateIntervalSchedule =
//   process.env.NODE_ENV === 'development' ? 3000 : 24 * 60 * 60 * 1000 // 2 sec in dev, 1 day in prod

// const runUpdate = () => {
//   setTimeout(async () => {
//     console.log('Updating meal...')

//     await updateMeal() // Your meal update function

//     runUpdate() // Recursively call after completion
//   }, updateIntervalSchedule)
// }
// runUpdate() // Start the loop

export const updateMaintenanceFeeService = async (
  id: Types.ObjectId,
  payload: { year: string; month: string },
) => {
  const { year, month } = payload
  const [meal, hall] = await Promise.all([
    Meal.isMealExists(id),
    Hall.findOne(),
  ])

  if (!meal) {
    throw new AppError(status.NOT_FOUND, 'the Meal is not exists! ')
  }

  if (!hall) {
    throw new AppError(status.NOT_FOUND, 'The Hall is not exists! ')
  }

  const isStudentExists = await Student.findOne({
    id: meal.id,
    _id: meal.student,
  })

  if (!isStudentExists) {
    throw new AppError(status.NOT_FOUND, 'the Meal is not exists! ')
  }

  if (
    [USER_STATUS.INACTIVE, USER_STATUS.BLOCKED].includes(isStudentExists.status)
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      `The Student is ${isStudentExists.status}`,
    )
  }
  if (
    meal?.mealInfo?.[currentYear][currentMonth].currentDeposit <
    hall?.hallPolicies?.maintenanceCharge
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      `Your current Deposit is very low, please Depost before and try again`,
    )
  }

  const currentDeposit =
    meal?.mealInfo?.[currentYear][currentMonth].currentDeposit -
    hall?.hallPolicies?.maintenanceCharge

  const update = await Meal.findByIdAndUpdate(id, {
    $set: {
      [`mealInfo.${year}.${month}.maintenanceFee`]:
        hall?.hallPolicies?.maintenanceCharge,
      [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
        currentDeposit,
    },
  })
  return update
}
