import { TAcademicFaculty } from './academicFaculty.interface'
import { academicFaculty } from './academicFaculty.model'

export const createAcademicFacultyService = async (
  payload: TAcademicFaculty,
) => {
  const isAcademicFacultyExists = await academicFaculty.findOne({
    name: payload.name,
  })

  if (isAcademicFacultyExists) {
    throw new Error('This Faculty is already Exists')
  }

  const createdFaculty = await academicFaculty.create(payload)
  return createdFaculty
}
