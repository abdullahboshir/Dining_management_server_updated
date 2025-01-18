import express from 'express'
import { academicFacultyController } from './academicFaculty.controller'
import validateRequest from '../../middlewares/validateRequest'
import { academicFacultyValidation } from './academicFaculty.validation'
const router = express.Router()

router.post(
  '/create-academic-faculty',
  validateRequest(academicFacultyValidation),
  academicFacultyController.createAcademicFaculty,
)

export const academicFacultyRoutes = router
