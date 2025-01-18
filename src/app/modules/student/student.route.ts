import express from 'express'
import {
  deleteStudentController,
  getAStudentController,
  getStudentController,
  updateStudentController,
} from './student.controller'

const router = express.Router()

router.get('/getStudents', getStudentController)
router.get('/getStudent/:studentId', getAStudentController)
router.delete('/:studentId', deleteStudentController)
router.patch('/:studentId', updateStudentController)

export const StudentRoutes = router
