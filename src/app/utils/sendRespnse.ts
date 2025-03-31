import { Response } from 'express'

type TResponse<T> = {
  statusCode: number
  success: boolean
  message?: String
  data: T
  meta?: {
    total: number
    page: number
    limit: number
  }
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data || null || undefined,
    meta: data.meta || null || undefined,
  })
}

export default sendResponse
