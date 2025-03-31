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

router.get('/getStudents', getStudentController)
router.get('/:studentId', getAStudentController)
router.delete('/:studentId', deleteStudentController)
router.patch('/:studentId', updateStudentController)

export const StudentRoutes = router
