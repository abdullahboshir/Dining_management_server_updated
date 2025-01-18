import { NextFunction, Request, Response } from 'express'
import status from 'http-status'

const globalErrorHandler = (
  err: any,
  req: Request,
  res: any,
  next: NextFunction,
) => {
  const statusCode = status.INTERNAL_SERVER_ERROR
  const message = err.message || 'Something went wrong!'

  return res.status(statusCode).json({
    success: false,
    message,
    error: err,
  })
}

export default globalErrorHandler
