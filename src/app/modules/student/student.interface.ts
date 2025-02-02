import { Document, Model, Types } from 'mongoose'
import { TMeal } from '../Meal/meal.interface'

export type TGuardian = {
  fatherName: string
  fatherOccupation: string
  fatherContactNo: string
  motherName: string
  motherOccupation: string
  motherContactNo: string
}

export type TAddress = {
  division: string
  district: string
  subDistrict: string
  alliance: string
  village: string
}

type TBloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
export type TUserName = {
  firstName: string
  middleName: string
  lastName: string
}

export type TAdmissionDetails = {
  admissionFee: string
  isAdmissionFeePaid: boolean
}

export type TStudent = Document & {
  adminId: Types.ObjectId
  hallId: Types.ObjectId
  diningId: Types.ObjectId
  managerId: Types.ObjectId
  id: string
  user: Types.ObjectId
  studentPin: string
  name: TUserName
  gender: 'Male' | 'Female' | 'other'
  dateOfBirth: Date
  phoneNumber: string
  email: string
  roomNumber: number
  seatNumber: string
  session: string
  classRoll: number
  status: 'active' | 'inactive' | 'blocked'
  department: string
  admissionDetails: TAdmissionDetails
  emergencyContact: string
  password: string
  role: 'superAdmin' | 'admin' | 'manager' | 'user' | 'moderator'
  profileImg?: string
  guardian: TGuardian
  presentAddress: TAddress
  permanentAddress: TAddress
  meals: Types.ObjectId
  bloodGroup: TBloodGroup
  academicDepartment: Types.ObjectId
  isDeleted: boolean
  createdAt?: Date
  updatedAt?: Date

  // Functions for schema logic
  validateStudentId: (value: number) => boolean
  validateEmailOrPhoneNumber: (value: string) => boolean
}

export interface StudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>
}
