import mongoose, { Document } from 'mongoose'
import { TMealInfo } from '../meal/meal.interface'

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

export type TStudent = Document & {
  authorId: mongoose.Schema.Types.ObjectId
  adminId: mongoose.Schema.Types.ObjectId
  diningId: mongoose.Schema.Types.ObjectId
  managerId: mongoose.Schema.Types.ObjectId
  studentId: number
  studentPin: string
  name: TUserName
  gender: 'Male' | 'Female' | 'other'
  roomNumber: number
  session: string
  status: 'active' | 'inactive' | 'blocked'
  department: string
  admissionFee: number
  emailOrPhoneNumber: string
  imergencyContact: string
  password: string
  role: 'superAdmin' | 'admin' | 'manager' | 'user' | 'moderator'
  profileImg?: string
  guardian: TGuardian
  presentAddress: TAddress
  permanentAddress: TAddress
  mealInfo: TMealInfo
  bloodGroup: TBloodGroup
  isDeleted: boolean
  createdAt?: Date
  updatedAt?: Date

  // Functions for schema logic
  validateStudentId: (value: number) => boolean
  validateEmailOrPhoneNumber: (value: string) => boolean
}
