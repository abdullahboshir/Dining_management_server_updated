import express from 'express'
import {
  deleteStudentController,
  getAStudentController,
  getStudentController,
  updateStudentController,
} from './student.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'

const router = express.Router()

router.get('/getStudents', auth(USER_ROLE.student), getStudentController)
router.get('/getStudent/:studentId', auth(), getAStudentController)
router.delete('/:studentId', deleteStudentController)
router.patch('/:studentId', updateStudentController)

export const StudentRoutes = router
