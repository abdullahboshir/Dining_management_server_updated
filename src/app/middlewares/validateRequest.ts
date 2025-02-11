import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'
import catchAsync from '../utils/catchAsync'

const validateRequest = (zodSchema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await zodSchema.safeParseAsync({ body: req.body, cookies: req.cookies })
    next()
  })
}

export default validateRequest
