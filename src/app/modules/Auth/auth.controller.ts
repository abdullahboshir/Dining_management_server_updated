import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import { createAcademicFacultyService } from '../AcademicFaculty/academicFaculty.service'
import sendResponse from '../../utils/sendRespnse'
import status from 'http-status'
import {
  forgetPasswordService,
  refreshTokenService,
  resetPasswordService,
  userChangePasswordService,
  userLoginService,
} from './auth.service'
import config from '../../config'

export const userLoginController: RequestHandler = catchAsync(
  async (req, res) => {
    const userInfo = req.body

    const result = await userLoginService(userInfo)
    const { accessToken, refreshToken, needsPasswordChange } = result

    res.cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
    })

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'User has been login successfully',
      data: {
        accessToken,
        needsPasswordChange,
      },
    })
  },
)

export const userChangePasswordController: RequestHandler = catchAsync(
  async (req, res) => {
    const inputPassword = req.body
    const user = req.user

    const result = await userChangePasswordService(user, inputPassword)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Password has been updated successfully',
      data: result,
    })
  },
)

export const refreshTokenController: RequestHandler = catchAsync(
  async (req, res) => {
    const { refreshToken } = req.cookies

    const result = await refreshTokenService(refreshToken)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Access Token has been retrieved successfully',
      data: result,
    })
  },
)

export const forgetPasswordController: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await forgetPasswordService(req.body.id)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Reset link has been generated successfully',
      data: result,
    })
  },
)

export const resetPasswordController: RequestHandler = catchAsync(
  async (req, res) => {
    const token = req.headers.authorization as string
    const result = await resetPasswordService(token, req.body)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Password has been reseted successfully',
      data: result,
    })
  },
)
