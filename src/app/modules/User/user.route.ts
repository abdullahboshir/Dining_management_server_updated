import express, { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middlewares/validateRequest'
import studentValidationSchema from '../Student/student.validation'
const router = express.Router()

router.post(
  '/create-student',
  // (req: Request, res: Response, next: NextFunction) => {
  //   req.body = JSON.parse(req.body.data)
  //   next()
  // },
  validateRequest(studentValidationSchema),
  UserController.createStudent,
)

export const UserRoutes = router
