import { NextFunction, Request, Response } from 'express'
import status from 'http-status'

const notFound = (req: Request, res: any, next: NextFunction) => {
  return res.status(status.NOT_FOUND).json({
    sucess: false,
    message: 'API Not Found!',
    error: '',
  })
}

export default notFound
