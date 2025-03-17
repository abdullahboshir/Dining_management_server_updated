import { startSession } from 'mongoose'
import { Manager } from './manager.model'
import status from 'http-status'
import AppError from '../../errors/AppError'
import User from '../User/user.model'
import { TManager } from './manager.interface'

export const getAllManagerService = async () => {
  const getManagers = await Manager.find()
  return getManagers
}

export const deleteManagerService = async (id: string) => {
  const session = await startSession()

  try {
    session.startTransaction()

    const deleteManager = await Manager.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )

    if (!deleteManager) {
      throw new AppError(status.BAD_REQUEST, 'Failed to delete manager')
    }

    const userId = deleteManager?.user

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

    return deleteManager
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

export const updateManagerService = async (
  id: string,
  payload: Partial<TManager>,
) => {
  console.log('managerrrrrrrrrrrrrrr', id, payload)

  const { name, ...remainingManagerData } = payload

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingManagerData,
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  const result = await Manager.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
  return result
}

export const getSingleManagerService = async (id: string) => {
  const result = await Manager.findOne({ id })
  return result
}
