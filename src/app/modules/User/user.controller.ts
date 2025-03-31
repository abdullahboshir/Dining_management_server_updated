import { RequestHandler } from 'express'
import httpStatus from 'http-status'
import {
  createAdminService,
  createManagerService,
  createStudentService,
  getMeService,
  updateUserStatusService,
} from './user.service'
import sendResponse from '../../utils/sendRespnse'
import catchAsync from '../../utils/catchAsync'
import { Types } from 'mongoose'

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { password, studentData } = req.body
  const result = await createStudentService(password, studentData, req.file)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student has been created successfully',
    data: result,
  })
})

const createManager: RequestHandler = catchAsync(async (req, res) => {
  const { password, managerData } = req.body
  const result = await createManagerService(password, managerData, req.file)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
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
    statusCode: httpStatus.OK,
    message: 'Admin has been created successfully',
    data: result,
  })
})

const updateUserStatus: RequestHandler = catchAsync(async (req, res) => {
  const { status } = req.body
  const userId = new Types.ObjectId(req.params.userId)
  const result = await updateUserStatusService(userId, status)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Status has been updated successfully',
    data: result,
  })
})

const getMe: RequestHandler = catchAsync(async (req, res) => {
  const { userId, role } = req?.user

  const result = await getMeService(userId, role)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User has been retrieved successfully',
    data: result,
  })
})

export const UserController = {
  createStudent,
  createManager,
  createAdmin,
  updateUserStatus,
  getMe,
}
