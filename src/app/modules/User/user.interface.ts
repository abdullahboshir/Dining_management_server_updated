import { Model, Types } from 'mongoose'
import { USER_ROLE } from './user.constant'

export type TUser = {
  _id?: Types.ObjectId 
  id: string
  phoneNumber: string
  email: string
  password: string
  fullName: string
  needsPasswordChange: boolean
  passwordChangedAt: Date
  role: 'superAdmin' | 'admin' | 'manager' | 'student' | 'moderator'
  status: 'active' | 'inactive' | 'blocked'
  profileImg?: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type TUserRole = keyof typeof USER_ROLE 

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string, email: string): Promise<TUser>
  isUserExistsById(id: Types.ObjectId): Promise<TUser>
  isUserExistsByEmail(email: string): Promise<TUser>
  isUserExistsByPhoneNumber(phoneNumber: string): Promise<TUser>

  isPasswordMatched(plainPass: string, hashedPass: string): Promise<boolean>

  isJWTIssuedBeforePasswordChanged(
    passwordChangedAtTime: Date,
    jwtIssuedTime: number,
  ): boolean
}
