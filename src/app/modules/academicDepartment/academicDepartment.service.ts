import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartment } from './academicDepartment.model'

export const createAcademicDepartmentService = async (
  payload: TAcademicDepartment,
) => {
  const isAcademicDepartmentExists = await AcademicDepartment.findOne({
    name: payload.name,
  })

  if (isAcademicDepartmentExists) {
    throw new Error('This Department is already Exists')
  }

  const createdDepartment = await AcademicDepartment.create(payload)
  return createdDepartment
}
