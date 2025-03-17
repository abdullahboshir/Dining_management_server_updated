import status from 'http-status'
import sendResponse from '../../utils/sendRespnse'
import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import { getAllDiningService } from './dining.service'

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

export const DiningController = {
  // createDining,
  getAllDinings,
}
