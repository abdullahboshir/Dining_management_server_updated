/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { startSession, Types } from 'mongoose'
import config from '../../config'
import { TUser } from './user.interface'
import User from './user.model'
import {
  generateAdminId,
  generateManagerId,
  generateStudentId,
} from './user.utils'
import { currentDateBD } from '../../utils/currentDateBD'
import { Hall } from '../Hall/hall.model'
import { Dining } from '../Dining/dining.model'
import { USER_ROLE } from './user.constant'
import AppError from '../../errors/AppError'
import { sendImageToCloudinary } from '../../utils/IMGUploader'
import { Manager } from '../Manager/manager.model'
import { Admin } from '../Admin/admin.model'
import status from 'http-status'
import { findRoleBaseUser } from '../Auth/auth.utils'

import { TMeal } from '../Meal/meal.interface'
import { TStudent } from '../Student/student.interface'
import { Student } from '../Student/student.model'
import { Meal } from '../Meal/meal.model'
import { mealInfoObj } from '../Meal/meal.const'

export const createStudentService = async (
  password: string,
  studentData: TStudent,
  file: Express.Multer.File,
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

  const isDiningExists = await Dining.findById({ _id: studentData.dining })

  if (!isDiningExists) {
    throw new Error('The Student has not under in Dining!')
  }

  // console.log

  const session = await startSession()
  try {
    //   start session
    session.startTransaction()
    const id = await generateStudentId(studentData)

    if (file) {
      const imgName = `${studentData.name.firstName}${id}`
      const imgPath = file?.path
      const { secure_url } = (await sendImageToCloudinary(
        imgName,
        imgPath,
      )) as any
      studentData.profileImg = secure_url
      userData.profileImg = secure_url
    } 

    // create User
    userData.id = id
    userData.password = password || config.default_pass
    userData.role = USER_ROLE?.student
    userData.email = studentData?.email
    userData.phoneNumber = studentData?.phoneNumber
    const { firstName, middleName, lastName } = studentData?.name
    userData.fullName = firstName + ' ' + middleName + ' ' + lastName

    const newUser = await User.create([userData], { session })


    if (!newUser.length) {
      throw new Error('Failed to create user!')
    }

    // create Student
    studentData.id = newUser[0].id
    studentData.user = newUser[0]._id
    studentData.admissionHistory = {
      amount: isHallExist?.hallPolicies?.admissionCharge,
      paymentStatus: true,
      date: new Date()
    }
    

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

    console.log('ddddddddddd', studentData)
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
    const id = await generateManagerId()

    if (file) {
      const imgName = `${managerData.name.firstName}${id}`
      const imgPath = file?.path
      const { secure_url } = (await sendImageToCloudinary(
        imgName,
        imgPath,
      )) as any
      managerData.profileImg = secure_url
      userData.profileImg = secure_url
    }

    // create User
    userData.id = id
    userData.password = password || config.default_pass
    userData.role = USER_ROLE.manager
    userData.email = managerData.email
    userData.phoneNumber = managerData?.phoneNumber
    const { firstName, middleName, lastName } = managerData?.name
    userData.fullName = firstName + ' ' + middleName + ' ' + lastName

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
    const id = await generateAdminId()

    if (file) {
      const imgName = `${adminData.name.firstName}${id}`
      const imgPath = file?.path
      const { secure_url } = (await sendImageToCloudinary(
        imgName,
        imgPath,
      )) as any
      adminData.profileImg = secure_url
      userData.profileImg = secure_url
    }

    // create User
    userData.id = id
    userData.password = password || config.default_pass
    userData.role = USER_ROLE.admin
    userData.email = adminData.email
    userData.phoneNumber = adminData?.phoneNumber
    const { firstName, middleName, lastName } = adminData?.name
    userData.fullName = firstName + ' ' + middleName + ' ' + lastName

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

export const updateUserStatusService = async (
  id: Types.ObjectId,
  status: string,
) => {
  const result = await User.findOneAndUpdate(
    id,
    {
      $set: { status },
    },
    { new: true },
  )

  return result
}

export const getMeService = async (_id: Types.ObjectId, role: string) => {

  const isUserExists = await User.findOne({ _id, role })

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User is not found')
  }

  const result = await findRoleBaseUser(isUserExists?.id, isUserExists?.email, isUserExists?.role);
 
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'The user not found!')
  }

  return result
}
