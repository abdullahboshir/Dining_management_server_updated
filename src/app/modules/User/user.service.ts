import { startSession } from 'mongoose'
import config from '../../config'
import { TStudent } from '../Student/student.interface'
import Student from '../Student/student.model'
import { TUser } from './user.interface'
import User from './user.model'
import { generatedStudentId } from './user.utils'

export const createStudentService = async (
  password: string,
  studentData: TStudent,
) => {
  const userData: Partial<TUser> = {}

  userData.password = config.default_pass || password

  userData.role = 'student'

  const session = await startSession()
  try {
    session.startTransaction()
    const id = await generatedStudentId(studentData)
    //   const existingUser = await Student.isUserExists(id)

    userData.id = id
    const newUser = await User.create([userData], { session })

    if (!newUser.length) {
      throw new Error('Failed to create user!')
    }

    studentData.id = newUser[0].id
    studentData.user = newUser[0]._id

    const newStudent = await Student.create([studentData], { session })

    if (!newUser.length) {
      throw new Error('Failed to create Student!')
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
