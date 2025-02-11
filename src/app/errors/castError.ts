import { Error } from 'mongoose'
import { TErrorSources, TGenericErrorResponse } from '../interface/error'

const castError = (err: Error.CastError): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ]

  const statusCode = 400

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  }
}

export default castError
