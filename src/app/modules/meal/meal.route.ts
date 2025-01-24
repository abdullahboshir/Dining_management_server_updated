import express from 'express'
import { mealController } from './meal.controller'

const router = express.Router()

router.patch('/meal-status/:mealId', mealController.updateMealStatus)
router.patch('/meal-currentDeposit/:mealId', mealController.addCurrentDeposit)

export const MealRoutes = router
