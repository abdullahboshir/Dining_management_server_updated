import { RequestHandler } from 'express'
import status from 'http-status'
import { createStudentService, getMeService } from './user.service'
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

const getMe: RequestHandler = catchAsync(async (req, res) => {
  const { userId, role } = req?.user
  const result = await getMeService(userId, role)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'User has been retrieved successfully',
    data: result,
  })
})

export const UserController = {
  createStudent,
  getMe,
}
