import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'

const validateRequest = (zodSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('before validate request', req.body)
      await zodSchema.safeParseAsync({ body: req.body })
      console.log('after validate request', { body: req.body })
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default validateRequest
