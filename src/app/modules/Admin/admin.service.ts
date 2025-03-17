import { startSession } from 'mongoose'
import status from 'http-status'
import AppError from '../../errors/AppError'
import User from '../User/user.model'
import { Admin } from './admin.model'

export const getAllAdminService = async () => {
  const getAdmins = await Admin.find().populate({ path: 'user' })
  return getAdmins
}

export const deleteAdminService = async (id: string) => {
  const session = await startSession()

  try {
    session.startTransaction()

    const deleteAdmin = await Admin.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )

    if (!deleteAdmin) {
      throw new AppError(status.BAD_REQUEST, 'Failed to delete Admin')
    }

    const userId = deleteAdmin?.user

    const deleteUser = await User.findOneAndUpdate(
      { _id: userId },
      { isDeleted: true },
      { new: true, session },
    )

    if (!deleteUser) {
      throw new AppError(status.BAD_REQUEST, 'Failed to delete user')
    }

    await session.commitTransaction()
    await session.endSession()

    return deleteAdmin
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}
