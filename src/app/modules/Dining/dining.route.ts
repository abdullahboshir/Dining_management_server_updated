import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { diningSchemaValidation } from './dining.validation'
import { DiningController } from './dining.controller'
const router = express.Router()

// no need to create dining manually because dining will be created automatically when server will be run.

/*router.post(
  '/create-dining',
    (req: Request, res: Response, next: NextFunction) => {
      // req.body = JSON.parse(req.body.data)
      console.log('req.bodyyyyyyyyyyyyy', req.body)
      next()
    },
  validateRequest(diningSchemaValidation),
  DiningController.createDining,
) */

router.get('/getAllDinings', DiningController.getAllDinings)

export const DiningRoutes = router
