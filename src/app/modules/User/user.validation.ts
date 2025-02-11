import { z } from 'zod'
import { USER_STATUS } from './user.constant'

export const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password can not be more than 20 characters')
    .optional(),
})

export const changeUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...USER_STATUS] as [string, ...string[]]),
  }),
})
