import { startSession, Types } from 'mongoose'
import config from '../../config'
import { TStudent } from '../Student/student.interface'
import Student from '../Student/student.model'
import { TUser } from './user.interface'
import User from './user.model'
import { generatedStudentId } from './user.utils'
import { TMeal } from '../Meal/meal.interface'
import Meal from '../Meal/meal.model'
import { mealInfoObj } from '../Meal/meal.const'
import { currentDateBD } from '../../utils/currentDateBD'

export const createStudentService = async (
  password: string,
  studentData: TStudent,
) => {
  const userData: Partial<TUser> = {}
  const mealData: Partial<TMeal> = {}

  userData.password = config.default_pass || password
  userData.role = 'student'

  const session = await startSession()
  try {
    //   start session
    session.startTransaction()
    const id = await generatedStudentId(studentData)
    //   const existingUser = await Student.isUserExists(id)

    // create User
    userData.id = id
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
