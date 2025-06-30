import express, { NextFunction, Request, Response } from 'express'
import {
  createNoticeController,
  getAllNoticesController,
  updatePinnedController,
} from './notice.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'
import { upload } from '../../utils/IMGUploader'
import validateRequest from '../../middlewares/validateRequest'
import { NoticeValidationSchema } from './notice.validation'
const router = express.Router()

router.post(
  '/create-notice',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.array('files', 6),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(NoticeValidationSchema),
  createNoticeController,
)

router.get('/getAllNotices', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.moderator, USER_ROLE.student), getAllNoticesController)

router.patch('/:noticeId', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.moderator, USER_ROLE.student), updatePinnedController)

export const NoticeRoutes = router
