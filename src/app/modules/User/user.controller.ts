import { RequestHandler } from 'express'
import status from 'http-status'
import {
  createAdminService,
  createManagerService,
  createStudentService,
  getMeService,
} from './user.service'
import sendResponse from '../../utils/sendRespnse'
import catchAsync from '../../utils/catchAsync'

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { password, studentData } = req.body
  console.log('ffffffffffffff', studentData)
  const result = await createStudentService(password, studentData, req.file)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Student has been created successfully',
    data: result,
  })
})

const createManager: RequestHandler = catchAsync(async (req, res) => {
  const { password, managerData } = req.body
  const result = await createManagerService(password, managerData, req.file)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Manager has been created successfully',
    data: result,
  })
})

const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { password, adminData } = req.body
  console.log('admin dataaaaaaaaa', req.body)
  const result = await createAdminService(password, adminData, req.file)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Admin has been created successfully',
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
  createManager,
  createAdmin,
  getMe,
}
