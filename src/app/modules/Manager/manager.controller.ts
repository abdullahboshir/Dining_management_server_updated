import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendRespnse'
import {
  deleteManagerService,
  getAllManagerService,
  getSingleManagerService,
  updateManagerService,
} from './manager.service'
import status from 'http-status'

export const getManagersController: RequestHandler = catchAsync(
  async (req, res) => {
    const getManagers = await getAllManagerService()
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Managers has been retrieved successfully',
      data: getManagers,
    })
  },
)

export const deleteManagerController: RequestHandler = catchAsync(
  async (req, res) => {
    const deleteManager = await deleteManagerService(req?.params?.managerId)
    console.log('hittttttttt', req.params.managerId)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Manager has been deleted successfully',
      data: deleteManager,
    })
  },
)

export const getSingleManagerController: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await getSingleManagerService(req?.params?.managerId)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Manager has been retrieved successfully',
      data: result,
    })
  },
)

export const updateManagerController: RequestHandler = catchAsync(
  async (req, res) => {
    const { managerId } = req.params
    const data = req.body
    const result = await updateManagerService(managerId, data)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Manager has been updated successfully',
      data: result,
    })
  },
)
