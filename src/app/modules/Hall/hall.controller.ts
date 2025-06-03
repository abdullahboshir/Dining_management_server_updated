import status from 'http-status'
import sendResponse from '../../utils/sendRespnse'
import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import { getAllHallsService, updateHallService } from './hall.service'
import { Types } from 'mongoose'

//  no need to create dining manually because dining will be created automatically when server will be run.

/*const createHall: RequestHandler = catchAsync(async (req, res) => {
  const hallData = req.body
  console.log('ddddddddddddddd', hallData)

  const result = await createHallService(hallData)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Hall has been created successfully',
    data: result,
  })
})*/

export const getAllHalls: RequestHandler = catchAsync(async (req, res) => {
  const getManagers = await getAllHallsService()
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Halls has been retrieved successfully',
    data: getManagers,
  })
})



export const updateHall: RequestHandler = catchAsync(async (req, res) => {
  const updateHallRes = await updateHallService(new Types.ObjectId(req.params?.hallId), req.body)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Hall has been retrieved successfully',
    data: updateHallRes,
  })
})

export const HallController = {
  // createHall,
  getAllHalls,
  updateHall
}
