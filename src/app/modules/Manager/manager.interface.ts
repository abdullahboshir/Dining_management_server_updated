import { Model, Types } from 'mongoose'

export type TGender = 'Male' | 'Female' | 'Other'
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

export type TManager = {
  createdBy: Types.ObjectId
  hall: Types.ObjectId
  dining: Types.ObjectId
  id: string
  user: Types.ObjectId
  name: TUserName
  gender: TGender
  dateOfBirth?: Date
  email: string
  phoneNumber: string
  emergencyContactNo: string
  bloodGroup?: TBloodGroup
  presentAddress: string
  permanentAddress: string
  profileImg?: string
  isDeleted: boolean
}

export interface ManagerModel extends Model<TManager> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TManager | null>
}
