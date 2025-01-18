import { z } from 'zod'

export const diningSchemaValidation = z.object({
  body: z.object({
    diningName: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name is too large'),
    divisionValue: z.string().min(1, 'Division is required'),
    districtValue: z.string().min(1, 'District is required'),
    subDistrictValue: z.string().min(1, 'Sub-district is required'),
    allianceValue: z.string().min(1, 'Alliance is required'),
    seatsNumber: z
      .number()
      .min(100, 'There must be at least one seat')
      .int('Seats number must be an integer'),
    phoneNumber: z.string().refine((value) => /^01\d{9}$/.test(value), {
      message:
        'Invalid phone number format. It must be 11 digits and start with 01.',
    }),
    password: z.string().refine(
      (value) => {
        // Strong password validation
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
        return passwordRegex.test(value)
      },
      {
        message:
          'Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character.',
      },
    ),
    applicationStartDate: z.string().nullable().optional(),
    applicationEndDate: z.string().nullable().optional(),
    applicationDate: z.date().default(() => new Date()),
    passwordChangedAt: z.date().nullable().optional(),
    passwordResetToken: z.string().nullable().optional(),
    passwordResetExpires: z.date().nullable().optional(),
  }),
})
