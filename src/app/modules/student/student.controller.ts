import { Request, Response } from 'express'
import {
  createStudentService,
  getAStudentService,
  getStudentService,
} from './student.service'
import 'colors'

export const createStudentController = async (req: Request, res: Response) => {
  try {
    const studentdata = req.body
    const result = await createStudentService(studentdata)
    res.status(200).json({
      success: true,
      message: 'Student has been created successfully',
      data: result,
    })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: `Student has been not successfully ${err.message.red}`,
    })
    console.log('got an error', err.message.red)
  }
}

export const getStudentController = async (req: Request, res: Response) => {
  try {
    const getStudent = await getStudentService()
    res.status(200).json({
      success: true,
      message: 'Student has been retrieved successfully',
      data: getStudent,
    })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: `Student has been not successfully ${err.message.red}`,
    })
  }
}

export const getAStudentController = async (req: Request, res: Response) => {
  try {
    const StudentId = req.params.studentId
    const getAStudent = await getAStudentService(StudentId)
    res.status(200).json({
      success: true,
      message: 'Student has been retrieved successfully',
      data: getAStudent,
    })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: `Student has been retrieved not successfully ${err.message.red}`,
    })
  }
}
