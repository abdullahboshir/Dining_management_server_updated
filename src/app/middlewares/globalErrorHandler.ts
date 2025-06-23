import { ErrorRequestHandler } from 'express'
import status from 'http-status'
import { ZodError, ZodIssue } from 'zod'
import { TErrorSources } from '../interface/error'
import config from '../config'
import { zodError } from '../errors/zodError'
import validationError from '../errors/validationError'
import castError from '../errors/castError'
import AppError from '../errors/AppError'

const globalErrorHandler: ErrorRequestHandler = (err, req, res: any, next) => {
  let statusCode = (status.INTERNAL_SERVER_ERROR as number) || 500
  const success = false
  let message = err || 'Something went wrong!'
  const error = err

  let errorSources: TErrorSources = [
    {
      path: '',
      message: message,
    },
  ]

  if (err instanceof ZodError) {
    const simplifiedError = zodError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = validationError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err?.name === 'CastError') {
    const simplifiedError = castError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err?.code === 11000) {
    const simplifiedError = castError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode
    message = err?.message
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
  } else if (err instanceof Error) {
    message = err?.message
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  })
}

export default globalErrorHandler
