import { Document, Types } from 'mongoose'

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


export type TAdmissionHistory = {
  amount: number
  paymentMethod?: string
  paymentStatus: boolean
  date: Date
}


export type TStudent = Document & {
  createdBy: Types.ObjectId
  hall: Types.ObjectId
  dining: Types.ObjectId
  id: string
  user: Types.ObjectId 
  role: 'superAdmin' | 'admin' | 'manager' | 'user' | 'moderator'
  studentPin: string
  name: TUserName
  gender: 'Male' | 'Female' | 'other'
  dateOfBirth: Date
  phoneNumber: string
  email: string
  password: string
  roomNumber: number
  seatNumber: number
  academicFaculty: string
  academicDepartment: string
  session: string
  classRoll: number
  status: 'active' | 'inactive' | 'blocked'
  admissionHistory: TAdmissionHistory
  emergencyContactNo: string
  bloodGroup: TBloodGroup
  profileImg?: string
  guardian: TGuardian
  presentAddress: TAddress
  permanentAddress: TAddress
  meals: Types.ObjectId
  isDeleted: boolean
  createdAt?: Date
  updatedAt?: Date

  // Functions for schema logic
  validateStudentId: (value: number) => boolean
  validateEmailOrPhoneNumber: (value: string) => boolean
}
