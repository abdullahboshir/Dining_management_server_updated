import express from 'express'
import {
  createStudentController,
  getAStudentController,
  getStudentController,
} from './student.controller'

const router = express.Router()

router.post('/create-student', createStudentController)
router.get('/getStudents', getStudentController)
router.get('/getStudent/:studentId', getAStudentController)

export const StudentRoutes = router
