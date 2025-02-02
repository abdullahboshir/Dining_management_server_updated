import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { diningSchemaValidation } from './dining.validation'
import { DiningController } from './dining.controller'
const router = express.Router()

router.post(
  '/create-dining',
  //   (req: Request, res: Response, next: NextFunction) => {
  //     // req.body = JSON.parse(req.body.data)
  //     console.log('req.bodyyyyyyyyyyyyy', req.body)
  //     next()
  //   },
  // validateRequest(diningSchemaValidation),
  // DiningController.createDining,
)

export const DiningRoutes = router
