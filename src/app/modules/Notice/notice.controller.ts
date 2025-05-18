import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendRespnse'
import httpStatus from 'http-status'
import {
  createNoticeService,
  getAllNoticesService,
  updatePinnedService,
} from './notice.service'

export const createNoticeController = catchAsync(async (req, res) => {
  const { noticeData } = req.body
  const data = await createNoticeService(noticeData)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notice has been created successfully',
    data,
  })
})

export const getAllNoticesController = catchAsync(async (req, res) => {
  
  const data = await getAllNoticesService(req.user, req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notice has been retrieved successfully',
    data,
  })
})

export const updatePinnedController = catchAsync(async (req, res) => {
  const { noticeId } = req.params
  const user = req.user;

  const data = await updatePinnedService(noticeId, user)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notice has been updated successfully',
    data,
  })
})
