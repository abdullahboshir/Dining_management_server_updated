import { startSession, Types } from 'mongoose'
import config from '../../config'
import { TStudent } from '../Student/student.interface'
import Student from '../Student/student.model'
import { TUser } from './user.interface'
import User from './user.model'
import {
  generatedAdminId,
  generatedManagerId,
  generatedStudentId,
} from './user.utils'
import { TMeal } from '../Meal/meal.interface'
import Meal from '../Meal/meal.model'
import { mealInfoObj } from '../Meal/meal.const'
import { currentDateBD } from '../../utils/currentDateBD'
import { Hall } from '../Hall/hall.model'
import { Dining } from '../Dining/dining.model'
import { USER_ROLE } from './user.constant'
import { verifyToken } from '../Auth/auth.utils'
import status from 'http-status'
import AppError from '../../errors/AppError'
import { JwtPayload } from 'jsonwebtoken'
import { sendImageToCloudinary } from '../../utils/IMGUploader'
import { Manager } from '../Manager/manager.model'
import { Admin } from '../Admin/admin.model'

export const createStudentService = async (
  password: string,
  studentData: TStudent,
  file: any,
) => {
  const userData: Partial<TUser> = {}
  const mealData: Partial<TMeal> = {}

  if (
    !Types.ObjectId.isValid(studentData.hall) ||
    !Types.ObjectId.isValid(studentData.dining)
  ) {
    throw new Error('invalid Dining or Hall!')
  }

  const isHallExist = await Hall.findById({ _id: studentData.hall })

  if (!isHallExist) {
    throw new Error('The Student has not under in the Hall!')
  }

  const isDiningExist = await Dining.findById({ _id: studentData.dining })

  if (!isDiningExist) {
    throw new Error('The Student has not under in Dining!')
  }

  // console.log

  const session = await startSession()
  try {
    //   start session
    session.startTransaction()
    const id = await generatedStudentId(studentData)

    if (file) {
      const imgName = `${studentData.name.firstName}${id}`
      const imgPath = file?.path
      const { secure_url } = (await sendImageToCloudinary(
        imgName,
        imgPath,
      )) as any
      studentData.profileImg = secure_url
    } else {
    }

    // create User
    userData.id = id
    userData.password = password || config.default_pass
    userData.role = USER_ROLE.student
    userData.email = studentData.email

    const newUser = await User.create([userData], { session })

    if (!newUser.length) {
      throw new Error('Failed to create user!')
    }

    // create Student
    studentData.id = newUser[0].id
    studentData.user = newUser[0]._id

    const newStudent = await Student.create([studentData], { session })

    if (!newStudent || !newStudent.length) {
      throw new Error('Failed to create Student!')
    }

    if (newStudent[0] && newStudent[0]._id instanceof Types.ObjectId) {
      mealData.student = newStudent[0]._id
      mealData.id = newStudent[0].id
    } else {
      throw new Error('Invalid student data')
    }

    // create Meal

    const { currentYear, currentMonth } = currentDateBD()
    // const currentYear = 2024
    // const currentMonth = 'December'

    mealData.mealInfo = {
      [currentYear]: {
        [currentMonth]: mealInfoObj, // the mealInfoObj import from,
      },
    }

    const newMeal = await Meal.create([mealData], { session })

    if (!newMeal || !newMeal.length) {
      throw new Error('Failed to create meal!')
    }

    // add meal id in student model for meal reference to student
    if (newMeal[0] && newMeal[0]._id instanceof Types.ObjectId) {
      const refMealId = (newStudent[0].meals = newMeal[0]._id)
      const studentId = newStudent[0]._id

      const updateMealId = await Student.findOneAndUpdate(
        { _id: studentId, id: newStudent[0].id },
        { $set: { meals: refMealId } },
        { new: true, session },
      )

      if (!updateMealId) {
        throw new Error('Failed to create meal!')
      }
    } else {
      throw new Error('Invalid student data')
    }

    await session.commitTransaction()
    await session.endSession()

    return newStudent
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error.message)
  }
}

export const createManagerService = async (
  password: string,
  managerData: TStudent,
  file: any,
) => {
  const userData: Partial<TUser> = {}

  if (
    !Types.ObjectId.isValid(managerData.hall) ||
    !Types.ObjectId.isValid(managerData.dining)
  ) {
    throw new Error('invalid Dining or Hall!')
  }

  const isHallExist = await Hall.findById({ _id: managerData.hall })

  if (!isHallExist) {
    throw new Error('The Student has not under in the Hall!')
  }

  const isDiningExist = await Dining.findById({ _id: managerData.dining })

  if (!isDiningExist) {
    throw new Error('The Student has not under in Dining!')
  }

  const session = await startSession()
  try {
    //   start session
    session.startTransaction()
    const id = await generatedManagerId()

    if (file) {
      const imgName = `${managerData.name.firstName}${id}`
      const imgPath = file?.path
      const { secure_url } = (await sendImageToCloudinary(
        imgName,
        imgPath,
      )) as any
      managerData.profileImg = secure_url
    } else {
    }

    // create User
    userData.id = id
    userData.password = password || config.default_pass
    userData.role = USER_ROLE.manager
    userData.email = managerData.email

    const newUser = await User.create([userData], { session })

    if (!newUser.length) {
      throw new Error('Failed to create user!')
    }

    // create Manager
    managerData.id = newUser[0].id
    managerData.user = newUser[0]._id

    const newManager = await Manager.create([managerData], { session })

    if (!newManager || !newManager.length) {
      throw new Error('Failed to create Manager!')
    }

    await session.commitTransaction()
    await session.endSession()

    return newManager
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error.message)
  }
}

export const createAdminService = async (
  password: string,
  adminData: TStudent,
  file: any,
) => {
  const userData: Partial<TUser> = {}

  if (
    !Types.ObjectId.isValid(adminData.hall) ||
    !Types.ObjectId.isValid(adminData.dining)
  ) {
    throw new Error('invalid Dining or Hall!')
  }

  const isHallExist = await Hall.findById({ _id: adminData.hall })

  if (!isHallExist) {
    throw new Error('The Student has not under in the Hall!')
  }

  const isDiningExist = await Dining.findById({ _id: adminData.dining })

  if (!isDiningExist) {
    throw new Error('The Student has not under in Dining!')
  }

  const session = await startSession()
  try {
    //   start session
    session.startTransaction()
    const id = await generatedAdminId()

    if (file) {
      const imgName = `${adminData.name.firstName}${id}`
      const imgPath = file?.path
      const { secure_url } = (await sendImageToCloudinary(
        imgName,
        imgPath,
      )) as any
      adminData.profileImg = secure_url
    } else {
    }

    // create User
    userData.id = id
    userData.password = password || config.default_pass
    userData.role = USER_ROLE.admin
    userData.email = adminData.email

    const newUser = await User.create([userData], { session })

    if (!newUser.length) {
      throw new Error('Failed to create user!')
    }

    // create Manager
    adminData.id = newUser[0].id
    adminData.user = newUser[0]._id

    const newAdmin = await Admin.create([adminData], { session })

    if (!newAdmin || !newAdmin.length) {
      throw new Error('Failed to create Admin!')
    }

    await session.commitTransaction()
    await session.endSession()

    return newAdmin
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error.message)
  }
}

export const getMeService = async (id: string, role: string) => {
  let result = null

  if (role === USER_ROLE.student) {
    result = await Student.findOne({ id }).populate('user')
  }

  // if (role === USER_ROLE.moderator) {
  //   result = await Student.findOne({ id }).populate('user')
  // }
  if (role === USER_ROLE.manager) {
    result = await Manager.findOne({ id }).populate('user')
  }
  if (role === USER_ROLE.admin) {
    result = await Admin.findOne({ id }).populate('user')
  }
  // if (role === USER_ROLE.superAdmin) {
  //   result = await Student.findOne({ id }).populate('user')
  // }

  return result
}
