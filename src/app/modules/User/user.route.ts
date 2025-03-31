import express, { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middlewares/validateRequest'
import studentValidationSchema from '../Student/student.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.constant'
import { upload } from '../../utils/IMGUploader'
import { managerValidationSchema } from '../Manager/manager.validation'
import { adminValidationSchema } from '../Admin/admin.validation'
const router = express.Router()

router.post(
  '/create-student',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(studentValidationSchema),
  UserController.createStudent,
)

router.post(
  '/create-manager',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(managerValidationSchema),
  UserController.createManager,
)

router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(adminValidationSchema),
  UserController.createAdmin,
)

router.patch('/status/:userId', UserController.updateUserStatus)

router.get(
  '/me',
  auth('student', 'moderator', 'manager', 'admin'),
  UserController.getMe,
)

export const UserRoutes = router
