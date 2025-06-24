import express from 'express'
import { mealController } from './meal.controller'

const router = express.Router()

router.get('/getMeals', mealController.getMeals)
router.get('/getSingleMeal/:mealId', mealController.getSingleMeal)
router.patch('/meal-status/:mealId', mealController.updateMealStatus)
router.patch(
  '/updateMaintenanceFee/:mealId',
  mealController.updateMaintenanceFee,
)
router.patch('/addDeposit/:mealId', mealController.addCurrentDeposit)

export const MealRoutes = router
