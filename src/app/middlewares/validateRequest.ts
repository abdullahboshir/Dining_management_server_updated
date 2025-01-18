import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'

const validateRequest = (zodSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   console.log('zod schemaaaaaaaaaaaaaaaa', zodSchema)
      console.log('validate bodyyyyyyyyyyyyy', { body: req.body })
      await zodSchema.parseAsync({ body: req.body })
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default validateRequest
