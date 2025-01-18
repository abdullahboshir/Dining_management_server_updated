import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import { createAcademicFacultyService } from './academicFaculty.service'
import sendResponse from '../../utils/sendRespnse'
import status from 'http-status'

const createAcademicFaculty: RequestHandler = catchAsync(async (req, res) => {
  const facultyData = req.body

  const result = await createAcademicFacultyService(facultyData)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Faculty has been created successfully',
    data: result,
  })
})

export const academicFacultyController = {
  createAcademicFaculty,
}
