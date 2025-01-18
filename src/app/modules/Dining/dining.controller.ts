import status from 'http-status'
import sendResponse from '../../utils/sendRespnse'
import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import { createDiningService } from './dining.service'

const createDining: RequestHandler = catchAsync(async (req, res) => {
  const diningData = req.body

  const result = await createDiningService(diningData)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Dining has been created successfully',
    data: result,
  })
})

export const DiningController = {
  createDining,
}
