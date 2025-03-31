import { startSession } from 'mongoose'
import { TStudent } from './student.interface'
import Student from './student.model'
import User from '../User/user.model'
import { updateMutableData } from './student.utils'

export const getAllStudentService = async () => {
  const getStudents = await Student.find().populate('user')
  return getStudents
}

export const getAStudentService = async (id: string) => {
  const getAStudent = await Student.findOne({ id })
  return getAStudent
}

export const deleteStudentService = async (id: string) => {
  const session = await startSession()
  try {
    session.startTransaction()
    const deleteAUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )

    if (!deleteAUser) {
      throw new Error('Failed to deleted student')
    }

    const deleteAStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )

    if (!deleteAStudent) {
      throw new Error('Failed to deleted User')
    }

    session.commitTransaction()
    session.endSession()

    return deleteAStudent
  } catch (error) {
    session.abortTransaction()
    session.endSession()
    throw new Error('Student deleted failed')
  }
}

export const updateStudentService = async (
  id: string,
  payload: Partial<TStudent>,
) => {
  const {
    name,
    guardian,
    presentAddress,
    permanentAddress,
    ...remainingStudentData
  } = payload

  const modifiedObj: Record<string, unknown> = {
    ...remainingStudentData,
  }

  // dynamic way of update mutable data
  updateMutableData(name, modifiedObj, 'name')
  updateMutableData(guardian, modifiedObj, 'guardian')
  updateMutableData(presentAddress, modifiedObj, 'presentAddress')
  updateMutableData(permanentAddress, modifiedObj, 'permanentAddress')

  // non dynamic way of update mutable data

  // if (name && Object.keys(name).length) {
  //   for (const [key, value] of Object.entries(name)) {
  //     modifiedUpdatedData[`name.${key}`] = value
  //   }
  // }

  // if (guardian && Object.keys(guardian).length) {
  //   for (const [key, value] of Object.entries(guardian)) {
  //     modifiedUpdatedData[`guardian.${key}`] = value
  //   }
  // }

  const result = await Student.findOneAndUpdate({ id }, modifiedObj, {
    new: true,
    runValidators: true,
  })
  return result
}
