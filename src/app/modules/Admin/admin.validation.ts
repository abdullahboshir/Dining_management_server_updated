import { z } from 'zod'
import { BloodGroup, Gender } from './admin.constant'

const objectIdRegex = /^[a-fA-F0-9]{24}$/

// Zod schema for the user name
const userNameSchema = z.object({
  firstName: z
    .string()
    .max(20, 'Name can not be more than 20 characters')
    .min(1, 'First Name is required')
    .trim(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .max(20, 'Name can not be more than 20 characters')
    .min(1, 'Last Name is required')
    .trim(),
})

// Zod schema for the Manager object
export const adminValidationSchema = z.object({
  createdBy: z.string().min(1, 'createdBy ID is required'),
  hall: z.string().regex(objectIdRegex, 'Invalid Hall format'),
  dining: z.string().regex(objectIdRegex, 'Invalid dining format'),
  user: z.string().min(1, 'User ID is required'),
  designation: z
    .enum(['Senior', 'Junior', 'Regular'])
    .refine((val) => ['Senior', 'Junior', 'Regular'].includes(val), {
      message: '{VALUE} is not a valid Designation',
    }),
  name: userNameSchema,
  gender: z
    .enum(['Male', 'Female', 'other'])
    .refine((val) => ['Male', 'Female', 'other'].includes(val), {
      message: '{VALUE} is not a valid gender',
    }),
  dateOfBirth: z.date().optional(),
  phoneNumber: z
    .string()
    .min(1, 'Phone Number is required')
    .regex(
      /^01\d{9}$/,
      'Invalid phone number format. It must be 11 digits and start with 01.',
    )
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .trim(),
  emergencyContactNo: z.string().min(1, 'Emergency contact number is required'),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),

  presentAddress: z.string().min(1, 'Present address is required'),
  permanentAddress: z.string().min(1, 'Permanent address is required'),
  profileImg: z.string().default(''),
  isDeleted: z.boolean().default(false),
})
