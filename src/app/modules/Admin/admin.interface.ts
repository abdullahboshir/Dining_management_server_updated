import { Model, Types } from 'mongoose'

export type TGender = 'Male' | 'Female' | 'Other'
export type TDesignation = 'Senior' | 'Junior' | 'Regular'
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'

export type TUserName = {
  firstName: string
  middleName: string
  lastName: string
}

export type TAdmin = {
  createdBy: Types.ObjectId
  hall: Types.ObjectId
  dining: Types.ObjectId
  id: string
  user: Types.ObjectId
  designation: TDesignation
  name: TUserName
  gender: TGender
  dateOfBirth?: Date
  email: string
  phoneNumber: string
  emergencyContactNo: string
  bloogGroup?: TBloodGroup
  presentAddress: string
  permanentAddress: string
  profileImg?: string
  isDeleted: boolean
}

export interface AdminModel extends Model<TAdmin> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TAdmin | null>
}
