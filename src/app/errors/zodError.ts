import { ZodError, ZodIssue } from 'zod'
import { TGenericErrorResponse } from '../interface/error'

export const zodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources = err.issues?.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    }
  })

  const statusCode = 500

  return {
    statusCode,
    message: ' Validation Error',
    errorSources,
  }
}
