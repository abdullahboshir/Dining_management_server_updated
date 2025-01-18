import { z } from 'zod'

const objectIdRegex = /^[a-fA-F0-9]{24}$/

// Guardian Subdocument Schema
const guardianValidationSchema = z.object({
  fatherName: z.string().trim().min(1, "Father's name is required"),
  fatherOccupation: z.string().trim().min(1, "Father's occupation is required"),
  fatherContactNo: z
    .string()
    .trim()
    .min(1, "Father's contact number is required"),
  motherName: z.string().trim().min(1, "Mother's name is required"),
  motherOccupation: z.string().trim().min(1, "Mother's occupation is required"),
  motherContactNo: z
    .string()
    .trim()
    .min(1, "Mother's contact number is required"),
})

// Address Subdocument Schema
const addressValidationSchema = z.object({
  division: z.string().trim().min(1, 'Division is required'),
  district: z.string().trim().min(1, 'District is required'),
  subDistrict: z.string().trim().min(1, 'SubDistrict is required'),
  alliance: z.string().trim().min(1, 'Alliance is required'),
  village: z.string().trim().min(1, 'Village is required'),
})

// Main Student Schema
const studentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).min(8).optional(),
    studentData: z.object({
      adminId: z.string().regex(objectIdRegex, 'Invalid adminId format'),
      diningId: z.string().regex(objectIdRegex, 'Invalid diningId format'),
      managerId: z.string().regex(objectIdRegex, 'Invalid managerId format'),
      studentPin: z
        .string()
        .min(5, 'Student PIN must be 5 digits')
        .max(5, 'Student PIN must be 5 digits')
        .regex(/^[0-9]{5}$/, 'Student PIN must contain exactly 5 digits'),

      name: z.object({
        firstName: z
          .string()
          .trim()
          .min(1, 'First name is required')
          .regex(/^[A-Z]/, 'First name should start with an uppercase letter'),
        middleName: z.string().trim().min(1, 'Middle name is required'),
        lastName: z
          .string()
          .trim()
          .min(1, 'Last name is required')
          .regex(/^[A-Za-z]+$/, 'Last name should only contain alphabets'),
      }),

      gender: z.enum(['Male', 'Female', 'other']),

      dateOfBirth: z.string().optional(), // Assuming it's a string in ISO format

      phoneNumber: z
        .string()
        .trim()
        .regex(
          /^01\d{9}$/,
          'Invalid phone number format. It must be 11 digits and start with 01.',
        ),

      email: z.string().trim().email('Invalid email format'),

      roomNumber: z
        .number()
        .int()
        .min(100, 'Room Number must be exactly 3 digits')
        .max(999, 'Room Number must be exactly 3 digits'),

      seatNumber: z
        .string()
        .min(2, 'Seat Number should be 2 digits')
        .max(2, 'Seat Number should be 2 digits'),

      session: z.string().trim().min(1, 'Session is required'),
      academicDepartment: z
        .string()
        .regex(objectIdRegex, 'Invalid Academic Department format'),

      admissionFee: z
        .number()
        .positive('Admission fee must be a positive number'),

      emergencyContact: z
        .string()
        .min(1, 'Emergency contact number is required'),

      profileImg: z.string().min(1, 'Profile image path is required'),

      guardian: guardianValidationSchema,

      presentAddress: addressValidationSchema,

      permanentAddress: addressValidationSchema,
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
    }),
  }),
})

export default studentValidationSchema
