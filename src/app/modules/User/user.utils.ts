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
