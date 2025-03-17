// src/validators/mealValidator.ts
import { z } from 'zod'

const objectIdRegex = /^[a-fA-F0-9]{24}$/

// Define the Zod schema to validate the meal data
export const mealValidator = z.object({
  student: z.string().regex(objectIdRegex, 'Invalid adminId format'),
  mealStatus: z.enum(['off', 'on']).default('off'),
  maintenanceFee: z.number().default(0),
  totalDeposit: z.number().default(0),
  currentDeposit: z.number().default(0),
  lastMonthRefund: z.number().default(0),
  dueMaintenanceFee: z.number().default(0),
  totalMeals: z.number().default(0),
  mealCharge: z.number().default(0),
  fixedMeal: z.number().default(0),
  fixedMealCharge: z.number().default(0),
  totalCost: z.number().default(0),
  dueDeposite: z.number().default(0),
  refundable: z.number().default(0),
})

// Type for meal data based on the Zod schema
export type MealInput = z.infer<typeof mealValidator>
