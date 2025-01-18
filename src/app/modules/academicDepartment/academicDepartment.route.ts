import express from 'express'
import { academicDepartmentController } from './academicDepartment.controller'
import validateRequest from '../../middlewares/validateRequest'
import { academicDepartmentValidation } from './academicDepartment.validation'

const router = express.Router()

router.post(
  '/create-academic-department',
  validateRequest(academicDepartmentValidation),
  academicDepartmentController.createAcademicDepartment,
)

export const academicDepartmentRoutes = router
