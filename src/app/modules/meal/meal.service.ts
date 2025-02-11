import { Types } from 'mongoose'
import {
  currentDateBD,
  getFutureDate,
  getLastDayOfMonth,
  previousDateBD,
} from '../../utils/currentDateBD'
import Student from '../Student/student.model'
import { TMeal } from './meal.interface'
import Meal from './meal.model'
import { mealInfoObj } from './meal.const'

const mealIntervals: { [key: string]: NodeJS.Timeout } = {}

const startMealIncreament = (mealId: Types.ObjectId) => {
  if (mealIntervals[mealId.toString()]) {
    throw new Error('Meal increment is already running for this meal')
  }

  mealIntervals[mealId.toString()] = setInterval(
    async () => {
      const meal = await Meal.findById({ _id: mealId })
      const { currentYear, currentMonth, currentDay } = currentDateBD()

      if (!meal) {
        throw new Error('Meal not found')
      }

      //   if not present new year and new month then set
      if (meal && meal.mealStatus === 'on') {
        if (!meal.mealInfo[currentYear]) {
          meal.mealInfo[currentYear] = {}
        }

        if (!meal.mealInfo[currentYear][currentMonth]) {
          meal.mealInfo[currentYear][currentMonth] = mealInfoObj // the mealInfoObj import from constant

          const { previousYear, previousMonth } = previousDateBD()

          await Meal.findByIdAndUpdate(
            { _id: meal._id },
            { $set: { mealInfo: meal.mealInfo } },
          )
        }

        const { futureYear, futureMonth, futureDay } = getFutureDate(1, 1, 2)
        // console.log(
        //   `Future Year: ${futureYear}, Future Month: ${futureMonth}, Future Day: ${futureDay}`,
        // )

        // // Example usage:
        // const year = '2025' // Year you want
        // const monthh = 'November'

        // const lastDay = getLastDayOfMonth(year, monthh)
        const { previousYear, previousMonth } = previousDateBD()

        console.log(`Last day of the month is: `, previousYear, previousMonth)
        // if (lastDay === currentDay) {
        //   if (
        //     meal &&
        //     meal.mealInfo[currentYear][currentMonth].currentDeposit >= 1
        //   ) {
        //     const refundableCost =
        //       meal.mealInfo[currentYear][currentMonth].currentDeposit -
        //       meal.mealInfo[currentYear][currentMonth].currentDeposit
        //     await Meal.findByIdAndUpdate()
        //   }
        // }

        const mealBaseObj = meal.mealInfo[currentYear][currentMonth]

        // if the currentDeposit is less then 80 then apply the feature
        if (
          meal.mealStatus === 'on' &&
          mealBaseObj.currentDeposit <= 80 + (80 / 100) * 10
        ) {
          try {
            stopMealIncrement(meal._id)
            await Meal.findByIdAndUpdate(
              { _id: meal._id },
              { $set: { mealStatus: 'off' } },
            )
            throw new Error(
              `Your current deposit is very low ${mealBaseObj.currentDeposit}`,
            )
          } catch (error: any) {
            console.log('got a error', error.message)
          }
        }

        const increamentAmount = 1
        const increamentTotal = (mealBaseObj.totalMeals += 1)

        const multiplyMeal = 80 * increamentAmount
        const currentDeposit = (mealBaseObj.currentDeposit -= multiplyMeal)
        const totalCost = (mealBaseObj.totalCost += multiplyMeal)

        const updatedMeal = await Meal.findByIdAndUpdate(
          mealId,
          {
            $set: {
              [`mealInfo.${currentYear}.${currentMonth}.totalMeals`]:
                increamentTotal,
              [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
                currentDeposit,
              [`mealInfo.${currentYear}.${currentMonth}.totalCost`]: totalCost,
            },
          },
          { new: true },
        )

        // if the currentDeposit is less then 80 then apply the feature
        if (
          meal.mealStatus === 'on' &&
          mealBaseObj.currentDeposit <= 80 + (80 / 100) * 10
        ) {
          try {
            stopMealIncrement(meal._id)
            await Meal.findByIdAndUpdate(
              { _id: meal._id },
              { $set: { mealStatus: 'off' } },
            )
            throw new Error(
              `Your current deposit is very low ${mealBaseObj.currentDeposit}`,
            )
          } catch (error: any) {
            console.log('got a error', error.message)
          }
        }

        console.log(
          'meal onnnnnnnnnn',
          updatedMeal?.mealInfo[currentYear][currentMonth],
        )
      } else {
        console.log('meal increament is failed')
      }
    },
    2000,
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
  mealId: string,
  mealStatus: string,
) => {
  if (!['on', 'off'].includes(mealStatus)) {
    throw new Error('Invalid meal status')
  }

  const isMealExists = await Meal.isMealExists(mealId)

  if (!isMealExists) {
    throw new Error('the Meal is not exists! ')
  }

  const isStudentExists = await Student.findOne({
    id: isMealExists.id,
    _id: isMealExists.student,
  })

  if (!isStudentExists) {
    throw new Error('the Meal is not exists! ')
  }

  if (isStudentExists.status === 'inactive') {
    throw new Error('The Student is inactive')
  }

  if (isStudentExists.status === 'blocked') {
    throw new Error('The Student is blocked')
  }

  const { currentYear, currentMonth } = currentDateBD()

  //   if not present new year and new month then set
  if (isMealExists && !isMealExists.mealInfo[currentYear]) {
    isMealExists.mealInfo[currentYear] = {}
  }

  if (!isMealExists.mealInfo[currentYear][currentMonth]) {
    isMealExists.mealInfo[currentYear][currentMonth] = mealInfoObj // the mealInfoObj import from constant

    await Meal.findByIdAndUpdate(
      { _id: isMealExists._id },
      { $set: { mealInfo: isMealExists.mealInfo } },
    )
  }

  if (
    isMealExists.mealInfo[currentYear][currentMonth].maintenanceFee !== 300 &&
    isMealExists.mealInfo[currentYear][currentMonth].currentDeposit < 200
  ) {
    throw new Error('Your current deposit is low, please deposit before')
  }

  const mealSwitch = await Meal.findByIdAndUpdate(
    { _id: isMealExists._id },
    { $set: { mealStatus } },
    { new: true },
  )

  if (!mealSwitch) {
    throw new Error('Update failed')
  }

  //   if meal is off
  if (['off'].includes(mealStatus) && mealSwitch.mealStatus === 'off') {
    stopMealIncrement(mealSwitch._id)
  }

  // if meal is on
  if (['on'].includes(mealStatus) && mealSwitch.mealStatus === 'on') {
    startMealIncreament(mealSwitch._id)
  }

  return mealSwitch
}

// -------------------------------------
// add meal Deposit
export const addMealDepositService = async (
  mealId: string,
  currentDeposit: number,
) => {
  const isMealExists = await Meal.isMealExists(mealId)

  if (!isMealExists) {
    throw new Error('the Meal is not exists! ')
  }

  const isStudentExists = await Student.findOne({
    id: isMealExists.id,
    _id: isMealExists.student,
  })

  if (!isStudentExists) {
    throw new Error('the Meal is not exists! ')
  }

  if (isStudentExists.status === 'inactive') {
    throw new Error('The Student is inactive')
  }

  if (isStudentExists.status === 'blocked') {
    throw new Error('The Student is blocked')
  }

  if (currentDeposit < 200) {
    throw new Error('Minimum deposit at least 200 hundred')
  }

  const { currentYear, currentMonth } = currentDateBD()

  //   const currentYear = '2026'
  //   const currentMonth = 'May'

  //   if not present new year and new month then set
  if (isMealExists && !isMealExists.mealInfo[currentYear]) {
    isMealExists.mealInfo[currentYear] = {}
  }

  if (!isMealExists.mealInfo[currentYear][currentMonth]) {
    isMealExists.mealInfo[currentYear][currentMonth] = mealInfoObj // the mealInfoObj import from constant

    const { previousYear, previousMonth } = previousDateBD()
    const baseCurrentMealObj = isMealExists.mealInfo[currentYear][currentMonth]
    const basePreviousMealObj =
      isMealExists.mealInfo[previousYear][previousMonth]

    const previousCurrentDeposit = basePreviousMealObj.currentDeposit

    const addToCurrentDeposit = (baseCurrentMealObj.currentDeposit =
      previousCurrentDeposit)

    let addToMaintenanceFee = 0
    if (
      basePreviousMealObj.currentDeposit >= 300 &&
      addToCurrentDeposit >= 300
    ) {
      addToMaintenanceFee = 300
      baseCurrentMealObj.maintenanceFee += addToMaintenanceFee
      baseCurrentMealObj.currentDeposit -= addToMaintenanceFee
    }

    baseCurrentMealObj.previousRefunded = previousCurrentDeposit

    baseCurrentMealObj.totalDeposit = previousCurrentDeposit

    basePreviousMealObj.refundable = previousCurrentDeposit

    basePreviousMealObj.currentDeposit = 0

    await Meal.findByIdAndUpdate(
      { _id: isMealExists._id },
      {
        $set: { mealInfo: isMealExists.mealInfo },
      },
    )
  }

  let result
  if (
    isMealExists.mealInfo[currentYear][currentMonth].maintenanceFee !== 300 &&
    isMealExists.mealInfo[currentYear][currentMonth].totalDeposit === 0 &&
    isMealExists.mealInfo[currentYear][currentMonth].currentDeposit === 0
  ) {
    if (currentDeposit < 500) {
      throw new Error('First Deposit should be Minimum 500 hundred')
    }

    const maintenanceFee = 300
    const netCurrentDeposit = currentDeposit - maintenanceFee
    const totalDeposit =
      isMealExists.mealInfo[currentYear][currentMonth].totalDeposit +
      netCurrentDeposit

    result = await Meal.findByIdAndUpdate(
      { _id: isMealExists._id },
      {
        $set: {
          [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
            netCurrentDeposit,
          [`mealInfo.${currentYear}.${currentMonth}.maintenanceFee`]:
            maintenanceFee,
          [`mealInfo.${currentYear}.${currentMonth}.totalDeposit`]:
            totalDeposit,
        },
      },
      { new: true },
    )
  } else {
    const totalDeposit =
      isMealExists.mealInfo[currentYear][currentMonth].totalDeposit +
      currentDeposit
    const netCurrentDeposit =
      isMealExists.mealInfo[currentYear][currentMonth].currentDeposit +
      currentDeposit

    result = await Meal.findByIdAndUpdate(
      { _id: isMealExists._id },
      {
        $set: {
          [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
            netCurrentDeposit,
          [`mealInfo.${currentYear}.${currentMonth}.totalDeposit`]:
            totalDeposit,
        },
      },
      { new: true },
    )
  }

  //   const maintenanceFee = 300
  //   const netCurrentDeposit = currentDeposit - maintenanceFee

  //    result = await Meal.findByIdAndUpdate(
  //     { _id: isMealExists._id },
  //     {
  //       $set: {
  //         [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]:
  //           netCurrentDeposit,
  //         [`mealInfo.${currentYear}.${currentMonth}.maintenanceFee`]:
  //           maintenanceFee,
  //       },
  //     },
  //     { new: true },
  //   )

  if (!result) {
    throw new Error('Failed to Deposit')
  }
  return result
}
