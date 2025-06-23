import AppError from '../../errors/AppError'
import { currentDateBD } from '../../utils/currentDateBD'
import { TStudent } from '../Student/student.interface'
import { USER_ROLE } from './user.constant'
import User from './user.model'

// Date
const { currentYear, currentMonth, currentDay } = currentDateBD()
const dateCode = `${currentYear}${currentMonth}${currentDay}`

export const findLastUser = async (
  role: string,
): Promise<string | undefined> => {
  try {
    const lastUser = await User.findOne({ role }, { id: 1 })
      .sort({ createdAt: -1 })
      .lean()

    return typeof lastUser?.id === 'string' ? lastUser.id : undefined
  } catch (error) {
    console.error('Error fetching last student user:', error)
    return undefined
  }
}

export const generateIncreament = (lastIncrement: string | undefined) => {
  try {
    let newIncrement = '00001'

    if (lastIncrement) {
      const match = lastIncrement.match(/^(.*)-(\d{5})-(\d{4}[A-Za-z]+[0-9]+)$/)
      if (match && match[2]) {
        const lastIncrement = parseInt(match[2], 10)
        newIncrement = String(lastIncrement + 1).padStart(5, '0')
      }
    }
    return newIncrement
  } catch (error) {
    console.error('Error fetching last student user:', error)
    return undefined
  }
}

export const generateStudentId = async (payload: TStudent): Promise<string> => {
  const { academicFaculty, session, classRoll, roomNumber, seatNumber } =
    payload || {}

  if (!academicFaculty || !session || !roomNumber || !seatNumber || !classRoll) {
    throw new Error('Missing required student fields for ID generation')
  }

  const facultyName = String(academicFaculty).padStart(2, '0')
  const sessionCode = String(session).replace(/\D/g, '')
  const roomCode = String(roomNumber).padStart(3, '0')
  const seatCode = String(seatNumber).padStart(2, '0')

  // Find last user ID
  const lastUserId = await findLastUser(USER_ROLE?.student)
  const newIncrement = generateIncreament(lastUserId)

  const finalId = `${facultyName}${sessionCode}${classRoll}${roomCode}${seatCode}-${newIncrement}-${dateCode}`

  return finalId
}

export const generateAdminId = async () => {
  const lastAdminId = await findLastUser(USER_ROLE?.admin)
  const newIncrement = generateIncreament(lastAdminId)

  const finalId = `${USER_ROLE?.admin}-${newIncrement}-${dateCode}`
  return finalId
}

export const generateManagerId = async () => {
  const lastManagerId = await findLastUser(USER_ROLE?.manager)
  const newIncrement = generateIncreament(lastManagerId)

  const finalId = `${USER_ROLE?.manager}-${newIncrement}-${dateCode}`
  return finalId
}
 