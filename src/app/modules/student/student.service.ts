import { TStudent } from './student.interface'
import Student from './student.model'

export const createStudentService = async (student: TStudent) => {
  const resCreateStudent = await Student.create(student)
  console.log('student created', resCreateStudent)
  return resCreateStudent
}

export const getStudentService = async () => {
  const getStudents = await Student.find()
  return getStudents
}

export const getAStudentService = async (id: string) => {
  const getAStudent = await Student.findOne({ studentId: id })
  return getAStudent
}
