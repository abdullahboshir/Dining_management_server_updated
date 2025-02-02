import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { academicDepartmentValidation } from './academicDepartment.validation'
import { academicDepartmentController } from './academicDepartment.controller'

const router = express.Router()

router.post(
  '/create-academic-department',
  validateRequest(academicDepartmentValidation),
  academicDepartmentController.createAcademicDepartment,
)

export const academicDepartmentRoutes = router
