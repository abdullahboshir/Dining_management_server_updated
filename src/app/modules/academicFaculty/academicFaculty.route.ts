import express from 'express'

import validateRequest from '../../middlewares/validateRequest'
import { academicFacultyValidation } from './academicFaculty.validation'
import { academicFacultyController } from './academicFaculty.controller'

const router = express.Router()

router.post(
  '/create-academic-faculty',
  validateRequest(academicFacultyValidation),
  academicFacultyController.createAcademicFaculty,
)

export const academicFacultyRoutes = router
