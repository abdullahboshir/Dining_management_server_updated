import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendRespnse'
import { deleteAdminService, getAllAdminService, getSingleAdminService, updateAdminService } from './admin.service'
import status from 'http-status'

export const getAllAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const getAdmins = await getAllAdminService()
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'All Admin has been retrieved successfully',
      data: getAdmins,
    })
  },
)

export const deleteAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const deleteAdmin = await deleteAdminService(req?.params?.adminId)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Admin has been deleted successfully',
      data: deleteAdmin,
    })
  },
)



export const getSingleAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await getSingleAdminService(req?.params?.adminId)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Admin has been retrieved successfully',
      data: result,
    })
  },
)

export const updateAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const { adminId } = req.params
    const data = req.body
    const result = await updateAdminService(adminId, data)
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Admin has been updated successfully',
      data: result,
    })
  },
)