import { NextFunction, Request, RequestHandler, Response } from 'express'
import status from 'http-status'
import studentValidationSchema from '../Student/student.validation'
import { createStudentService } from './user.service'
import sendResponse from '../../utils/sendRespnse'
import catchAsync from '../../utils/catchAsync'

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { password, studentData } = req.body

  const result = await createStudentService(password, studentData)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Student has been created successfully',
    data: result,
  })
})

export const UserController = {
  createStudent,
}
