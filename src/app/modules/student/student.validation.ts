import { z } from 'zod'

// Guardian Subdocument Schema
const guardianSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is required').trim(),
  fatherOccupation: z.string().min(1, 'Father Occupation is required').trim(),
  fatherContactNo: z.string().min(1, 'Father Contact No is required').trim(),
  motherName: z.string().min(1, 'Mother Name is required').trim(),
  motherOccupation: z.string().min(1, 'Mother Occupation is required').trim(),
  motherContactNo: z.string().min(1, 'Mother Contact No is required').trim(),
})

// Address Subdocument Schema
const addressSchema = z.object({
  division: z.string().min(1, 'Division is required'),
  district: z.string().min(1, 'District is required'),
  subDistrict: z.string().min(1, 'SubDistrict is required'),
  alliance: z.string().min(1, 'Alliance is required'),
  village: z.string().min(1, 'Village is required'),
})

// Main Student Schema
const studentValidationSchema = z.object({
  createdBy: z.string().min(1, 'ID is required'),
  hall: z.string().min(1, 'Hall is required'),
  dining: z.string().min(1, 'Dining is required'),
  user: z.string().min(1, 'User ID is required'),
  name: z.object({
    firstName: z.string().min(1, 'First Name is required').trim(),
    middleName: z.string().trim().optional(),
    lastName: z.string().min(1, 'Last Name is required').trim(),
  }),
  gender: z.enum(['Male', 'Female', 'other']),
  dateOfBirth: z.string().optional(),
  phoneNumber: z
    .string()
    .min(11, 'Phone Number is required')
    .max(11, 'Phone Number must be exactly 11 digits')
    .regex(
      /^01\d{9}$/,
      'Phone number must start with 01 and contain exactly 11 digits',
    ),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  roomNumber: z
    .number()
    .min(100, 'Room Number must be 3 digits')
    .max(999, 'Room Number must be 3 digits'),
  seatNumber: z
    .string()
    .regex(/^\d{1}$/, 'Seat Number must be exactly 1 digits'),
  academicFaculty: z.string().min(1, 'Academic Faculty is required').trim(),
  academicDepartment: z
    .string()
    .min(1, 'Academic Department is required')
    .trim(),
  session: z.string().min(1, 'Session is required').trim(),
  classRoll: z.number().min(1, 'Class Roll is required'),
  admissionHistory: z.object({
  amount: z.number().min(0, 'Amount must be positive'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  paymentStatus: z.boolean(),
  admittedBy: z.string().min(1, 'AdmittedBy is required'),
  date: z.union([z.string(), z.date()]), // Accept both ISO string and Date object
}),
  emergencyContact: z.string().min(1, 'Emergency Contact Number is required'),
  profileImg: z.string().optional().default(''),
  guardian: guardianSchema,
  presentAddress: addressSchema,
  permanentAddress: addressSchema,
  meals: z.string().optional(),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
})

const capitalize = (str: string = '') =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export default studentValidationSchema
