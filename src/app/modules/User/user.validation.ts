import { z } from 'zod'

export const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password can not be more than 20 characters')
    .optional(),
})
