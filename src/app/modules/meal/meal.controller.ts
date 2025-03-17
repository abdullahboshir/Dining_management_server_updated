import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendRespnse'
import status from 'http-status'
import {
  addMealDepositService,
  getMealsService,
  updateMealStatusService,
} from './meal.service'

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

const updateMealStatus: RequestHandler = catchAsync(async (req, res) => {
  const { mealStatus } = req.body
  const mealId = req.params.mealId
  const result = await updateMealStatusService(mealId, mealStatus)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Meal has been updated successfully',
    data: result,
  })
})

const addCurrentDeposit: RequestHandler = catchAsync(async (req, res) => {
  const { currentDeposit } = req.body
  const mealId = req.params.mealId

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
  updateMealStatus,
  addCurrentDeposit,
}
