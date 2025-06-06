import express from 'express'
import { AuthValidation } from './auth.validation'
import validateRequest from '../../middlewares/validateRequest'
import {
  changePasswordController,
  forgetPasswordController,
  refreshTokenController,
  resetPasswordController,
  // userChangePasswordController,
  userLoginController,
} from './auth.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'

const router = express.Router()

// do not used anymore auth guard in the refresh token and login end point
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  userLoginController,
)



// do not used anymore auth guard in the refresh token and login end point
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  refreshTokenController,
)

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  forgetPasswordController,
)
router.post(
  '/reset-password',
  // validateRequest(AuthValidation.resetPasswordValidationSchema),
  resetPasswordController,
)
router.post(
  '/change-password',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.moderator,
    USER_ROLE.student,
  ),
  validateRequest(AuthValidation.changePasswordValidationSchema),
changePasswordController
)


// router.post(
//   '/change-password',
//   auth(
//     USER_ROLE.superAdmin,
//     USER_ROLE.admin,
//     USER_ROLE.manager,
//     USER_ROLE.moderator,
//     USER_ROLE.student,
//   ),
//   validateRequest(AuthValidation.changePasswordValidationSchema),
//   userChangePasswordController,
// )

export const AuthRoutes = router
