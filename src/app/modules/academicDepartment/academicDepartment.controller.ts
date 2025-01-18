import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendRespnse'
import status from 'http-status'
import { createAcademicDepartmentService } from './academicDepartment.service'

const createAcademicDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const departmentData = req.body

    const result = await createAcademicDepartmentService(departmentData)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'academic Department has been created successfully',
      data: result,
    })
  },
)

export const academicDepartmentController = {
  createAcademicDepartment,
}
