import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { HallController } from './hall.controller'
import { hallSchemaValidation } from './hall.validation'

const router = express.Router()

router.post(
  '/create-hall',
  validateRequest(hallSchemaValidation),
  HallController.createHall,
)

export const HallRoutes = router
