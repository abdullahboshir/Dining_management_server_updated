import { startSession } from 'mongoose'
import config from '../config'
import { Dining } from '../modules/Dining/dining.model'
import { Hall } from '../modules/Hall/hall.model'
import { mealInfoObj } from '../modules/Meal/meal.const'
import {Meal} from '../modules/Meal/meal.model'
import { USER_ROLE } from '../modules/User/user.constant'
import User from '../modules/User/user.model'
import { currentDateBD } from '../utils/currentDateBD'
import AppError from '../errors/AppError'
import { initialDiningObj, initialHallObj } from './initial.const'

const superUser = {
  id: 'superAdmin-0001',
  phoneNumber: '01500000000',
  email: 'superAdmin@gmail.com',
  password: config.super_admin_pass,
  fullName: 'Super Admin',
  needsPasswordChange: true,
  role: USER_ROLE.superAdmin,
  status: 'active',
  profileImg:
    'https://img.freepik.com/premium-vector/professional-male-muslim-cartoon-character-with-colour-gradient-background_1138840-1957.jpg?semt=ais_hybrid',
  isDeleted: false,
}

export const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin })

  if (!isSuperAdminExists) {
    await User.create(superUser)
  }
}

export const seedHallandDining = async (hallName: string) => {
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin })

  const isHallExist = await Hall.find()
  const isDiningExist = await Dining.find()

  if (
    isSuperAdminExists &&
    isHallExist.length === 0 &&
    isDiningExist.length === 0
  ) {
    const session = await startSession()
    try {
      session.startTransaction()

      const hallObj = initialHallObj(isSuperAdminExists?._id)

      isSuperAdminExists && (hallObj.superAdmin = isSuperAdminExists?._id)
      isSuperAdminExists &&
        (hallObj.hallName = hallName ? hallName : hallObj?.hallName)

      const createdHall = await Hall.create([hallObj], { session })

      if (!createdHall.length) {
        await Hall.create([hallObj], { session })
        throw new AppError(400, 'Failed to create Hall!')
      }

      const diningObj = initialDiningObj(createdHall[0]?._id)

      diningObj && (diningObj.hall = createdHall[0]?._id)

      diningObj &&
        (diningObj.diningName = createdHall[0]?.hallName
          ? `Dining of ${createdHall[0]?.hallName}`
          : diningObj?.diningName)

      const createdDining = await Dining.create([diningObj], { session })

      if (!createdDining.length) {
        await Dining.create([diningObj], { session })
        throw new AppError(400, 'Failed to create Dining!')
      }

      await session.commitTransaction()
      await session.endSession()
      return createdDining
    } catch (error: any) {
      await session.abortTransaction()
      await session.endSession()
      throw new AppError(400, error.message)
    }
  }
}

export const seedMeal = async () => {
  const { currentYear, currentMonth } = currentDateBD()

  await Meal.updateMany(
    { [`mealInfo.${currentYear}.${currentMonth}`]: { $exists: false } },
    { $set: { [`mealInfo.${currentYear}.${currentMonth}`]: mealInfoObj } },
  )
}
