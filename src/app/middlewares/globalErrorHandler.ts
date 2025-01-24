import { ErrorRequestHandler } from 'express'
import status from 'http-status'
import { ZodError, ZodIssue } from 'zod'
import { TErrorSourse } from '../interface/error'
import config from '../config'

const globalErrorHandler: ErrorRequestHandler = (err, req, res: any, next) => {
  let statusCode = status.INTERNAL_SERVER_ERROR || 500
  let message = err.message || 'Something went wrong!'

  let errorSources: TErrorSourse = [
    {
      path: '',
      message: 'Something went Wrong',
    },
  ]

  const handleZodError = (err: ZodError) => {
    const errorSources = err.issues?.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue.message,
      }
    })

    return {
      statusCode,
      message: ' Validation Error',
      errorSources,
    }
  }

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
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
