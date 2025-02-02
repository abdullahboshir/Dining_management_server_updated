import status from 'http-status'
import sendResponse from '../../utils/sendRespnse'
import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import { createHallService } from './hall.service'

const createHall: RequestHandler = catchAsync(async (req, res) => {
  const hallData = req.body
  console.log('ddddddddddddddd', hallData)

  const result = await createHallService(hallData)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Hall has been created successfully',
    data: result,
  })
})

export const HallController = {
  createHall,
}
