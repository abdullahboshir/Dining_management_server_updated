import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendRespnse'
import status from 'http-status'
import {
  addMealDepositService,
  getMealsService,
  getSingleMealsService,
  updateMaintenanceFeeService,
  updateMealStatusService,
} from './meal.service'
import { Types } from 'mongoose'

export const getMeals: RequestHandler = catchAsync(async (req, res) => {
  const result = await getMealsService()
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Meals has been retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})

export const getSingleMeal: RequestHandler = catchAsync(async (req, res) => {
  const { mealId } = req.params
  const result = await getSingleMealsService(mealId)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Meals has been retrieved successfully',
    data: result,
  })
})

const updateMealStatus: RequestHandler = catchAsync(async (req, res) => {
  const { mealStatus } = req.body
  const mealId = new Types.ObjectId(req.params.mealId)
  const result = await updateMealStatusService(mealId, mealStatus)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Meal has been updated successfully',
    data: result,
  })
})

const updateMaintenanceFee: RequestHandler = catchAsync(async (req, res) => {
  const body = req.body
  const mealId = new Types.ObjectId(req.params.mealId)
  const result = await updateMaintenanceFeeService(mealId, body)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Maintenance Fee has been updated successfully',
    data: result,
  })
})

const addCurrentDeposit: RequestHandler = catchAsync(async (req, res) => {
  const currentDeposit = Number(req.body?.currentDeposit)
  const mealId = new Types.ObjectId(req.params.mealId)

  const result = await addMealDepositService(mealId, currentDeposit)

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Deposit has been added successfully',
    data: result,
  })
})

export const mealController = {
  getMeals,
  getSingleMeal,
  updateMealStatus,
  addCurrentDeposit,
  updateMaintenanceFee,
}
