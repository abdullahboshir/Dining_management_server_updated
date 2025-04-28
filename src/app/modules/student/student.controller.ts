import { Request, Response } from 'express'
import studentValidationSchema from './student.validation'
import {
  deleteStudentService,
  getAStudentService,
  getAllStudentService,
  updateStudentService,
} from './student.service'
import sendResponse from '../../utils/sendRespnse'
import catchAsync from '../../utils/catchAsync'
import status from 'http-status'

export const getStudentController = async (req: Request, res: Response) => {
  try {
    const getStudent = await getAllStudentService(req?.query)
    res.status(200).json({
      success: true,
      message: 'Student has been retrieved successfully',
      data: getStudent,
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Student has been not successfully ${err.message.red}`,
      error: err,
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
    res.status(500).json({
      success: false,
      message: `Student has been retrieved not successfully ${err.message.red}`,
      error: err,
    })
  }
}

export const deleteStudentController = catchAsync(async (req, res) => {
  const result = await deleteStudentService(req.params.studentId)
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Student has been Deleted successfully',
    data: result,
  })
})

export const updateStudentController = catchAsync(async (req, res) => {
  const result = await updateStudentService(
    req.params.studentId,
    req.body.studentData,
  )
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Student has been Updated successfully',
    data: result,
  })
})
