import express from 'express'
import { HallController } from './hall.controller'

const router = express.Router()

// no need to create Hall manually because Hall will be created automatically when server will be run.

/*router.post(
  '/create-hall',
  validateRequest(hallSchemaValidation),
  HallController.createHall,
)*/

router.get('/getAllHalls', HallController.getAllHalls)

export const HallRoutes = router
