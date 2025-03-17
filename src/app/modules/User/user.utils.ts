import { TStudent } from '../Student/student.interface'
import User from './user.model'

const findLastUser = async () => {
  const lastUser = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean()
  return lastUser?.id ? lastUser.id : undefined
}

export const generatedStudentId = async (payload: TStudent) => {
  const lastUserId = await findLastUser()
  let increamentId

  let generatedId = '0'

  if (lastUserId) {
    generatedId = lastUserId?.substring(9)
  }
  increamentId = (Number(generatedId) + 1).toString().padStart(4, '0')
  increamentId = `${payload.session}${payload.roomNumber}${payload.seatNumber}${increamentId}`

  return increamentId
}

// manager ID
export const findLastManager = async () => {
  const lastManager = await User.findOne(
    {
      role: 'manager',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastManager?.id ? lastManager.id.substring(2) : undefined
}

// Admin ID
export const findLastAdmin = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined
}

export const generatedManagerId = async () => {
  let currentId = (0).toString()
  const lastManagerId = await findLastManager()

  if (lastManagerId) {
    currentId = lastManagerId.substring(2)
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

  incrementId = `M-${incrementId}`
  return incrementId
}

export const generatedAdminId = async () => {
  let currentId = (0).toString()
  const lastManagerId = await findLastAdmin()

  if (lastManagerId) {
    currentId = lastManagerId.substring(2)
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

  incrementId = `A-${incrementId}`
  return incrementId
}
