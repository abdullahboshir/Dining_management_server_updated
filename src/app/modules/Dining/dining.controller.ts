import status from 'http-status'
import sendResponse from '../../utils/sendRespnse'
import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import { getAllDiningService, updateDiningService } from './dining.service'
import { Types } from 'mongoose'

// no need to create dining manually because dining will be created automatically when server will be run.

/*const createDining: RequestHandler = catchAsync(async (req, res) => {
  const diningData = req.body

  const result = await createDiningService(diningData)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Dining has been created successfully',
    data: result,
  })
})*/

export const getAllDinings: RequestHandler = catchAsync(async (req, res) => {
  const getDinings = await getAllDiningService()
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Dinings has been retrieved successfully',
    data: getDinings,
  })
})


export const updateDining: RequestHandler = catchAsync(async (req, res) => {
  const updateDiningRes = await updateDiningService(new Types.ObjectId(req.params?.diningId), req.body)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Dinings has been retrieved successfully',
    data: updateDiningRes,
  })
})

export const DiningController = {
  // createDining,
  getAllDinings,
  updateDining
}
